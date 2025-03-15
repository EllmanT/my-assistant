import {
  initializeApp,
  getApps,
  App,
  cert,
  getApp,
  ServiceAccount,
} from "firebase-admin/app";
// import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
// import serviceKey from "@/service_key.json";
import { buildFirebaseJson } from "./lib/firebaseJsonBuilder";
import { getStorage } from "firebase-admin/storage";

// const serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_KEY as string);

// as ServiceAccount;
let app: App;

const credentials = buildFirebaseJson();
console.log(
  "Generated Firebase Credentials:",
  JSON.stringify(credentials, null, 2)
); // Pretty-print for better visibility

if (!credentials || typeof credentials !== "object") {
  console.error("Error: Credentials are invalid.");
}

if (getApps().length === 0) {
  console.log("Initializing Firebase App...");
  app = initializeApp({
    credential: cert(credentials as ServiceAccount),
    // credential: admin.credential.cert(serviceKey),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);
const adminStorage = getStorage(app);

export { app as adminApp, adminDb, adminStorage };
