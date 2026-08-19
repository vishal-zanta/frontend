import { useEffect, useState } from "react";
import { checkIdbDataExpiry } from "../../helpers";
import { getExternalMasterData } from "@/api/externalDept.api";
import { postFormFields } from "@/lib/idb";
let dummy = {
  categoryId: [
    { label: "Teacher Absenteeism", value: 112 },
    { label: "School Infrastructure & Facilities", value: 113 },
    { label: "Mid-Day Meal (MDM) Quality", value: 114 },
    { label: "Textbook & Uniform Distribution", value: 115 },
  ],
  source: [
    { label: "Helpline (14417)", value: "HELPLINE" },
    { label: "Web Portal", value: "WEB" },
    { label: "Mobile App", value: "MOBILE_APP" },
    { label: "In-Person / Walk-in", value: "IN_PERSON" },
  ],
  districtCode: [
    { label: "Patna (1007)", value: 1007 },
    { label: "Gaya (1008)", value: 1008 },
    { label: "Muzaffarpur (1009)", value: 1009 },
    { label: "Bhagalpur (1010)", value: 1010 },
  ],
  blockCode: [
    { label: "Patna Sadar (0)", value: 0 },
    { label: "Danapur (101)", value: 101 },
    { label: "Phulwari Sharif (102)", value: 102 },
    { label: "Bikram (103)", value: 103 },
  ],
  clusterCode: [
    { label: "Cluster Center 01 (0)", value: 0 },
    { label: "Cluster Center 02 (201)", value: 201 },
    { label: "Cluster Center 03 (202)", value: 202 },
    { label: "Cluster Center 04 (203)", value: 203 },
  ],
  panchayatCode: [
    { label: "Panchayat 01 (0)", value: 0 },
    { label: "Panchayat 02 (301)", value: 301 },
    { label: "Panchayat 03 (302)", value: 302 },
    { label: "Panchayat 04 (303)", value: 303 },
  ],
  villageCode: [
    { label: "Village 01 (0)", value: 0 },
    { label: "Village 02 (401)", value: 401 },
    { label: "Village 03 (402)", value: 402 },
    { label: "Village 04 (403)", value: 403 },
  ],
  schoolCode: [
    { label: "Govt Middle School (0)", value: 0 },
    { label: "Govt High School Danapur (501)", value: 501 },
    { label: "Primary School Kankarbagh (502)", value: 502 },
    { label: "Kanya Uchha Vidyalaya (503)", value: 503 },
  ],
  teacherCode: [
    { label: "Teacher Not Assigned / General (0)", value: 0 },
    { label: "Anil Sharma - TGT Math (601)", value: 601 },
    { label: "Sunita Kumari - PRT (602)", value: 602 },
    { label: "Rakesh Verma - PGT Science (603)", value: 603 },
  ],
};

export const useGetFieldsOptions = (departmentCode = "EDUCATION") => {
  const isLoading = false;
  const error = null;

  const [fields, setFields] = useState(dummy);

  const types = [
    "categories",
    "districts",
    // "blocks",
    // "panchayats",
    // "villages",
    // "schools",
    // "statuses",
    "sources",
  ];

  async function getDataFromApi() {
    return Promise.all(
      types.map((t) => getExternalMasterData(departmentCode, { type: t })),
    );
  }

  useEffect(() => {
    async function getData() {
      try {
        if (!departmentCode) return;
        const { dataFromDb, isExpired } =
          await checkIdbDataExpiry(departmentCode);
        if (dataFromDb && !isExpired) {
          console.log("Using cached data");
          setFields(dataFromDb?.fields);
        } else
           {
          console.log("Fetching from api data");

          const data = await getDataFromApi();
          let [categoriesData, districtsData, sourcesData] = data.map(
            (d) => d.data?.data,
          );

          let mappedData = {
            categoryId: categoriesData.map((c) => ({
              label: `${c.type}-${c.subType}`,
              value: c.categoryId,
            })),
            districtCode: districtsData.map((d) => ({
              label: d.districtName,
              value: d.districtCode,
            })),
            source: sourcesData.map((s) => ({
              label: s.source,
              value: s.source,
            })),
            // status: statusesData.map(s=> ({label: s.name, value: s.key}))
          };
          await postFormFields(departmentCode, mappedData);
          setFields(mappedData);
       
        }
      } catch (error) {
        console.error("Error in fields", error);
      }
    }

    getData();
  }, [departmentCode]);

  // console.log({fields});

  return { fields, isLoading, error };
};



export const useGetBlockOptions = (districtCode, departmentCode = "EDUCATION") => {
  const [blockOptions, setBlockOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlockOptions() {
      if (!districtCode) {
        setBlockOptions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getExternalMasterData(departmentCode, {
          type: "blocks",
          districtCode,
        });

        const blocksData = response?.data?.data || [];
        const formattedBlocks = Array.isArray(blocksData)
          ? blocksData.map((b) => ({
              label: b.blockName,
              value: b.blockCode,
            }))
          : [];

        setBlockOptions(formattedBlocks);
      } catch (err) {
        console.error("Error in block options", err);
        setError(err);
        setBlockOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlockOptions();
  }, [districtCode, departmentCode]);

  return { blockOptions, isLoading, error };
};

export const useGetPanchayatOptions = (blockCode, departmentCode = "EDUCATION") => {
  const [panchayatOptions, setPanchayatOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPanchayatOptions() {
      if (!blockCode) {
        setPanchayatOptions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getExternalMasterData(departmentCode, {
          type: "panchayats",
          blockCode,
        });

        const panchayatsData = response?.data?.data || [];
        const formattedPanchayats = Array.isArray(panchayatsData)
          ? panchayatsData.map((p) => ({
              label: p.panchayatName ,
              value: p.panchayatCode ,
            }))
          : [];

        setPanchayatOptions(formattedPanchayats);
      } catch (err) {
        console.error("Error in panchayat options", err);
        setError(err);
        setPanchayatOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPanchayatOptions();
  }, [blockCode, departmentCode]);

  return { panchayatOptions, isLoading, error };
};

export const useGetVillageOptions = (blockCode, departmentCode = "EDUCATION") => {
  const [villageOptions, setVillageOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVillageOptions() {
      if (!blockCode) {
        setVillageOptions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getExternalMasterData(departmentCode, {
          type: "villages",
          blockCode,
        });

        const villagesData = response?.data?.data || [];
        const formattedVillages = Array.isArray(villagesData)
          ? villagesData.map((v) => ({
              label: v.villageName,
              value: v.villageCode ,
            }))
          : [];

        setVillageOptions(formattedVillages);
      } catch (err) {
        console.error("Error in village options", err);
        setError(err);
        setVillageOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVillageOptions();
  }, [blockCode, departmentCode]);

  return { villageOptions, isLoading, error };
};

export const useGetSchoolOptions = (blockCode, departmentCode = "EDUCATION") => {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSchoolOptions() {
      if (!blockCode) {
        setSchoolOptions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getExternalMasterData(departmentCode, {
          type: "schools",
          blockCode,
        });

        const schoolsData = response?.data?.data || [];
        const formattedSchools = Array.isArray(schoolsData)
          ? schoolsData.map((s) => ({
              label: s.schoolName ,
              value: s.schoolCode ,
            }))
          : [];

        setSchoolOptions(formattedSchools);
      } catch (err) {
        console.error("Error in school options", err);
        setError(err);
        setSchoolOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchoolOptions();
  }, [blockCode, departmentCode]);

  return { schoolOptions, isLoading, error };
};

export const useGetPanchayatsOptions = useGetPanchayatOptions;
export const useGetVillagesOptions = useGetVillageOptions;
export const useGetSchoolsOptions = useGetSchoolOptions;


