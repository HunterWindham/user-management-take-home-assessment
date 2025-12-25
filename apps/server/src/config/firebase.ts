import admin from "firebase-admin";
import serviceAccount from "../../service-account.json";

if (!process.env.DB_URL) {
  throw new Error("DB_URL environtment variable is required");
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.DB_URL,
  });
} catch (error) {
  throw new Error(`Failed to initialize Firebase: ${error}`);
}

export const db = admin.database();
