import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const dbname = process.env.DB_NAME || undefined;

if (!uri) {
  throw new Error("❌ A variável MONGODB_URI não está definida no .env");
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbname);
}
