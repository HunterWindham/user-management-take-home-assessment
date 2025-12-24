import admin from "firebase-admin";
const serviceAccount = require("../../service-account.json");
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB_URL,
  });
} catch (err) {
  throw err;
}

const db = admin.database();
export default db;
