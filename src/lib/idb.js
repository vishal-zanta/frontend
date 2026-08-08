import { openDB } from "idb";

export const dbPromise = openDB("AppDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("forms")) {
      db.createObjectStore("forms", {
        keyPath: "id",
      });
    }
  },
});

export const postFormFields = async (id, fields = {}) => {
  const db = await dbPromise;
  return await db.put("forms", {
    id,
    fields,
    cachedAt: Date.now(),
  });
};

export const getFormsFields = async (id) => {
  const db = await dbPromise;
  return await db.get("forms", id);
};
