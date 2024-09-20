// src/utils/dbUtils.ts
import { openDB } from "idb";
import JSZip from "jszip";

const DB_NAME = "spotifyData";
const DB_VERSION = 1;
const STORE_NAME = "jsonFiles";

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" });
      }
    },
  });
  return db;
}

export async function gatherFileNames() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const keys = await store.getAllKeys();
  await tx.done;
  return keys;
}

export async function fetchDataFromIndexedDB(p0: string) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const data = await store.get(p0);
  
  if (data && data.file instanceof Blob) {
    const text = await data.file.text();
    const jsonData = JSON.parse(text);
    return jsonData;
  }

  await tx.done;
  return null;
}

async function unzipFiles(acceptedFiles: File[]) {
  const jsonFiles: File[] = [];

  for (const file of acceptedFiles) {
    if (file.type === "application/zip") {
      const zip = await JSZip.loadAsync(file);
      for (const relativePath in zip.files) {
        const zipEntry = zip.files[relativePath];
        if (zipEntry.name.endsWith(".json")) {
          const content = await zipEntry.async("blob");
          const jsonFile = new File([content], zipEntry.name, {
            type: "application/json",
          });
          jsonFiles.push(jsonFile);
        }
      }
    } else if (file.type === "application/json") {
      jsonFiles.push(file);
    }
  }

  return jsonFiles;
}

export async function storeFilesInIndexedDB(acceptedFiles: File[]) {
  const jsonFiles = await unzipFiles(acceptedFiles);

  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  await store.clear();

  for (const jsonFile of jsonFiles) {
    await store.put({ name: jsonFile.name, file: jsonFile });
  }

  await tx.done;
}

export async function storeMapDatainIndexedDB(mapData: Map<string, any>) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  for (const [key, value] of mapData) {
    const jsonFile = new File([JSON.stringify(value)], key, {
      type: "application/json",
    });
    await store.put({ name: key, file: jsonFile });
  }

  await tx.done;
}

export async function gatherMapData(key: string) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const data = await store.get(key);

  if (data && data.file instanceof Blob) {
    const text = await data.file.text();
    const jsonData = JSON.parse(text);
    return jsonData;
  }

  await tx.done;
  return null;
}