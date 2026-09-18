import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'https://portal-backend.lumirex.tech/api/v1';
const AUTH_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNjczZDc2YzliYzIyN2I0NTk5OTJmMSIsInJvbGVzIjpbeyJfaWQiOiI2YTY3M2Q0YTM5ZDNiYTY0MGRhYmU5ZmEiLCJkZXNpZ25hdGlvbkVuZ2xpc2giOiJBZG1pbiIsIl9fdiI6MCwiYWN0aXZlIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDI2LTA3LTI3VDExOjEzOjE0LjcyNVoiLCJkZXNpZ25hdGlvbkhpbmRpIjoiQWRtaW4iLCJsZXZlbCI6IkFkbWluIiwicGVybWlzc2lvbnMiOlsiQUxMIl0sInVwZGF0ZWRBdCI6IjIwMjYtMDctMjdUMTE6MTM6MTQuNzI1WiJ9XSwiaWF0IjoxNzg5NzMwNzIxLCJleHAiOjE3ODk4MTcxMjF9.O3sXjQrz-m21V5jE26nlglB5XfaIJivvkrBUV1lMy_g';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: AUTH_TOKEN,
    Origin: 'https://portal.lumirex.tech',
    Referer: 'https://portal.lumirex.tech/',
  },
});

async function getAllExistingDepartments() {
  try {
    const response = await apiClient.get('/departments');
    const list = response.data?.data || response.data || [];
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn('Could not fetch existing departments:', err.response?.data?.message || err.message);
    return [];
  }
}

async function createOrGetDepartment(deptKey, existingDepartments) {
  // Check if department already exists by title
  const existing = existingDepartments.find(
    (d) =>
      d.title?.trim().toLowerCase() === deptKey.trim().toLowerCase() ||
      d.titleHindi?.trim().toLowerCase() === deptKey.trim().toLowerCase()
  );

  if (existing && (existing._id || existing.id)) {
    console.log(`[DEPT] Found existing department "${deptKey}" (ID: ${existing._id || existing.id})`);
    return existing._id || existing.id;
  }

  try {
    const response = await apiClient.post('/departments', {
      title: deptKey,
      titleHindi: deptKey,
    });
    const created = response.data?.data || response.data;
    const id = created?._id || created?.id;
    console.log(`[DEPT] Created department "${deptKey}" (ID: ${id})`);
    return id;
  } catch (err) {
    console.error(
      `[DEPT ERROR] Failed to create department "${deptKey}":`,
      err.response?.data?.message || err.response?.data || err.message
    );
    // If creation failed because it might already exist, try fetching departments again
    const refreshed = await getAllExistingDepartments();
    const found = refreshed.find(
      (d) =>
        d.title?.trim().toLowerCase() === deptKey.trim().toLowerCase() ||
        d.titleHindi?.trim().toLowerCase() === deptKey.trim().toLowerCase()
    );
    if (found && (found._id || found.id)) {
      return found._id || found.id;
    }
    throw err;
  }
}

async function addService(service, departmentId) {
  const payload = {
    title: service.english,
    titleHindi: service.hindi,
    department: departmentId,
    departmentObj: {},
    sla: 48
  };

  try {
    const response = await apiClient.post('/services', payload);
    const created = response.data?.data || response.data;
    console.log(`  -> [SERVICE] Added: "${service.english}"`);
    return created;
  } catch (err) {
    console.error(
      `  -> [SERVICE ERROR] Failed to add "${service.english}":`,
      err.response?.data?.message || err.response?.data || err.message
    );
    return null;
  }
}

async function main() {
  const jsonPath = path.join(__dirname, 'departments.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const departmentsData = JSON.parse(rawData);

  const deptEntries = Object.entries(departmentsData);
  console.log(`Found ${deptEntries.length} departments to process.`);

  const existingDepartments = await getAllExistingDepartments();
  console.log(`Found ${existingDepartments.length} existing departments in the database.\n`);

  let totalServicesAttempted = 0;
  let totalServicesSuccess = 0;

  for (let i = 0; i < deptEntries.length; i++) {
    const [deptKey, services] = deptEntries[i];
    console.log(`\n========================================`);
    console.log(`[${i + 1}/${deptEntries.length}] Processing Department: "${deptKey}"`);
    console.log(`Services to add: ${services.length}`);
    console.log(`========================================`);

    try {
      const departmentId = await createOrGetDepartment(deptKey, existingDepartments);
      if (!departmentId) {
        console.error(`Skipping services for "${deptKey}" due to missing department ID.`);
        continue;
      }

      for (let s = 0; s < services.length; s++) {
        const service = services[s];
        totalServicesAttempted++;
        const res = await addService(service, departmentId);
        if (res) totalServicesSuccess++;
        // Small delay to prevent rate-limiting
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    } catch (err) {
      console.error(`Error processing department "${deptKey}":`, err.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`COMPLETED!`);
  console.log(`Departments processed: ${deptEntries.length}`);
  console.log(`Services added successfully: ${totalServicesSuccess}/${totalServicesAttempted}`);
  console.log(`========================================`);
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

/**
 * 
 * Services Added: 203 / 210 successfully created (the remaining 7 were existing/duplicate titles like generic "Other" / "Others").
 */