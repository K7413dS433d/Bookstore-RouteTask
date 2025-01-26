import { MongoClient } from "mongodb";

const uri = process.env.databaseURI;
// local host might not work because of convert localhost to ip v4 or v6
const client = new MongoClient(uri);
//specify the database
export const db = client.db(process.env.database);

const connectDB = async () => {
  await client
    .connect()
    .then(() => {
      console.log("database connected");
    })
    .catch((error) => {
      console.log("failed to connect to database", error.message);
    });
};

export default connectDB;
