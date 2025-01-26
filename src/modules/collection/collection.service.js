import { db } from "../../DB/connection.js";
import { booksValidator as validator } from "./collection.schema.js";

// explicitly create books collection
export const createBooksCol = async (req, res, next) => {
  try {
    //check if it exist
    const isExist = await db.listCollections({ name: "books" }).toArray();
    if (isExist.length > 0)
      return res
        .status(409)
        .json({ success: false, message: "collection already exist" });

    // create collection
    await db.createCollection("books", {
      validator,
    });

    res.status(201).json({
      success: true,
      message: "books collection created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error,
    });
  }
};

// implicitly create author collection
export const createAuthorCol = async (req, res, next) => {
  try {
    const { name, nationality } = req.body;

    const isExist = await db.listCollections({ name: "authors" }).toArray();

    if (isExist.length > 0)
      return res
        .status(409)
        .json({ success: false, message: "collection already exist" });

    const result = await db.collection("authors").insertOne({
      name,
      nationality,
    });

    if (!result.acknowledged)
      return res.status(500).json({
        success: false,
        message: "Error insert in database implicitly",
      });

    res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// create capped collection named logs
export const createLogsCol = async (req, res, next) => {
  try {
    const isExist = await db.listCollections({ name: "logs" }).toArray();

    if (isExist.length > 0)
      return res
        .status(409)
        .json({ success: false, message: "collection already exist" });

    await db.createCollection("logs", { capped: true, size: 1 * 1024 * 1024 });

    res.status(201).json({ ok: 1 });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//create title field as index in books collection
export const createBooksIdx = async (req, res, next) => {
  try {
    const result = await db
      .collection("books")
      .createIndex("title", { unique: true });

    return res.status(201).json({
      success: true,
      message: "index created successfully",
      index: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
