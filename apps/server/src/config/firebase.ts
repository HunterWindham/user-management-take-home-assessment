import admin from "firebase-admin";
const serviceAccount = require("../../service-account.json");

if (!process.env.DB_URL) {
  throw new Error("DB_URL environtment variable is required");
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB_URL,
  });
} catch (error) {
  throw new Error("Failed to initialize Firebase");
}

const db = admin.database();
export default db;
