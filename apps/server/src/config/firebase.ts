import admin from "firebase-admin";

// Validate required environment variables
const requiredEnvVars = [
  "DB_URL",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_PRIVATE_KEY_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_CLIENT_ID",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} environment variable is required`);
  }
}

// Construct service account object from environment variables
// Replace literal \n with actual newlines in the private key
// Using Record type since ServiceAccount type doesn't include all JSON properties
const serviceAccount = {
  type: "service_account",
  projectId: process.env.FIREBASE_PROJECT_ID!,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  clientId: process.env.FIREBASE_CLIENT_ID!,
  authUri:
    process.env.FIREBASE_AUTH_URI ||
    "https://accounts.google.com/o/oauth2/auth",
  tokenUri:
    process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  authProviderX509CertUrl:
    process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ||
    "https://www.googleapis.com/oauth2/v1/certs",
  clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL || "",
  universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com",
} as admin.ServiceAccount;

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB_URL!,
  });
} catch (error) {
  throw new Error(`Failed to initialize Firebase: ${error}`);
}

export const db = admin.database();
