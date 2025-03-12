import {
  initializeApp,
  getApps,
  App,
  // cert,
  getApp,
  // ServiceAccount,
} from "firebase-admin/app";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
// import serviceKey from "@/service_key.json";
import { getStorage } from "firebase-admin/storage";

const serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_KEY as string);

// as ServiceAccount;
let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    // credential: cert(serviceKey as ServiceAccount),
    credential: admin.credential.cert(serviceKey),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);
const adminStorage = getStorage(app);

export { app as adminApp, adminDb, adminStorage };
