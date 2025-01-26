import { db } from "./../../DB/connection.js";
import { ObjectId } from "mongodb";
export const addLog = async (req, res, next) => {
  try {
    let { book_id, action } = req.body;
    book_id = new ObjectId(book_id);

    //check existence
    const isExist = await db.collection("books").findOne({ _id: book_id });

    if (!isExist)
      return res.status(404).json({ success: false, message: "not found id" });

    const result = await db.collection("logs").insertOne({ book_id, action });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
