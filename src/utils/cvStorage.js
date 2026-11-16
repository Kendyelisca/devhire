const DB_NAME = "devhire-files";
const STORE_NAME = "candidate-cvs";
const DB_VERSION = 1;

function openCVDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCV(applicationId, file) {
  const database = await openCVDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.put(file, applicationId);

    transaction.oncomplete = () => {
      database.close();
      resolve(true);
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error("CV storage was interrupted."));
    };
  });
}

export async function getCV(applicationId) {
  const database = await openCVDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(applicationId);

    request.onsuccess = () => resolve(request.result || null);

    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
  });
}
