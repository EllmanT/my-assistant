import {
  initializeApp,
  getApps,
  App,
  cert,
  getApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceKey from "@/service_key.json";
import { getStorage } from "firebase-admin/storage";

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceKey as ServiceAccount),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);
const adminStorage = getStorage(app);

export { app as adminApp, adminDb, adminStorage };
