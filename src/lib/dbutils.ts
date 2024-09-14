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

export async function fetchDataFromIndexedDB() {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const allData = await store.getAll();
  await tx.done;
  return allData;
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