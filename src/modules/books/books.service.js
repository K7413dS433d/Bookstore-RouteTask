import { ObjectId } from "mongodb";
import { db } from "../../DB/connection.js";

// add books
export const addBook = async (req, res, next) => {
  try {
    const result = await db.collection("books").insertOne(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (!req.body.title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });

    if (error.errorResponse.code == 11000)
      return res
        .status(409)
        .json({ success: false, message: "Duplicated title is forbidden" });

    return res.status(500).json({ success: false, message: error });
  }
};

// add many books
//! ordered insert until error occur to  stop this use startSession
export const addManyBooks = async (req, res, next) => {
  try {
    if (req.body.length < 3)
      return res
        .status(400)
        .json({ success: false, message: "minimum number of books is 3" });
    const result = await db.collection("books").insertMany(req.body);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// update book by title
export const updateBook = async (req, res, next) => {
  try {
    const title = req.params.title;

    //check existence
    const isExist = await db.collection("books").findOne({ title });

    if (!isExist)
      return res
        .status(404)
        .json({ success: false, message: `book with ${title} not found` });

    const result = await db
      .collection("books")
      .updateOne({ title }, { $set: { year: 2022 } }, { acknowledged: 1 });
    const { acknowledged, matchedCount, modifiedCount } = result;

    return res.status(200).json({ acknowledged, matchedCount, modifiedCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// find book by title
export const findByTitle = async (req, res, next) => {
  try {
    const { title } = req.query;
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "no title for search" });

    //search
    const result = await db.collection("books").findOne({ title });
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "book not found" });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// find books by publish date interval
export const findByDate = async (req, res, next) => {
  try {
    let { from, to } = req.query;

    from = +from;
    to = +to;
    console.log(to, from);

    if (!from || !to)
      return res.status(400).json({
        success: false,
        message: "bad request query must send correctly",
      });

    //search
    const result = await db
      .collection("books")
      .find({ year: { $gte: from, $lte: to } }, { projection: { _id: 0 } })
      .toArray();

    return res
      .status(result.length == 0 ? 404 : 200)
      .json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//find using genre
export const findByGenre = async (req, res, next) => {
  try {
    const { genre } = req.query;
    if (!genre)
      return res.status(400).json({
        success: false,
        message: "bad request query must send correctly",
      });

    const result = await db
      .collection("books")
      .find({ genres: { $all: [genre] } })
      .toArray();

    res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//using skip 2 and limit 3 and sort by year in descending order
export const skip_limit = async (req, res, next) => {
  try {
    //! find method apply sort first
    // const result = await db
    //   .collection("books")
    //   .find()
    //   .skip(2)
    //   .limit(3)
    //   .sort({ year: 1 })
    //   .toArray();

    const result = await db
      .collection("books")
      .aggregate([{ $skip: 2 }, { $limit: 3 }, { $sort: { year: -1 } }])
      .toArray();

    res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//find by integer year
export const findByIntYear = async (req, res, next) => {
  try {
    const result = await db
      .collection("books")
      .find({
        $or: [{ year: { $type: "int" } }, { year: { $type: "long" } }],
      })
      .sort({ year: 1 })
      .toArray();

    res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//exclude genre
export const excludeGenres = async (req, res, next) => {
  try {
    const { genre } = req.query; //array

    const result = await db
      .collection("books")
      .find({ genres: { $nin: typeof genre == "object" ? genre : [genre] } })
      .toArray();

    res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//delete all before date
export const deleteBeforeDate = async (req, res, next) => {
  try {
    const { year } = req.query;

    const result = await db
      .collection("books")
      .deleteMany({ year: { $lt: +year } });

    if (result.deletedCount == 0)
      return res.status(404).json({
        success: false,
        message: "there is no books published before this date",
      });

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get by date and filter and sort aggregate1
export const aggregate1 = async (req, res, next) => {
  try {
    const result = await db
      .collection("books")
      .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: 1 } }])
      .toArray();

    res
      .status(result.length == 0 ? 404 : 200)
      .json({ success: !result.length == 0, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get by date and filter and sort aggregate2
export const aggregate2 = async (req, res, next) => {
  try {
    const result = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $sort: { year: 1 } },
        { $project: { genres: 0, _id: 0 } },
      ])
      .toArray();

    res
      .status(result.length == 0 ? 404 : 200)
      .json({ success: !result.length == 0, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// group documents aggregate3
export const aggregate3 = async (req, res, next) => {
  try {
    const result = await db
      .collection("books")
      .aggregate([
        { $unwind: "$genres" },
        { $project: { _id: 0, title: 1, genres: 1 } },
      ])
      .toArray();

    res
      .status(result.length == 0 ? 404 : 200)
      .json({ success: !result.length == 0, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// join books with logs aggregate4
export const aggregate4 = async (req, res, next) => {
  try {
    const result = await db
      .collection("logs")
      .aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book_id",
            foreignField: "_id",
            as: "book_details",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  genres: 0,
                },
              },
            ],
          },
        },
        { $project: { action: 1, book_details: 1, _id: 0 } },
      ])
      .toArray();

    if (result.length == 0)
      return res
        .status(404)
        .json({ success: false, message: "no logs history" });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
