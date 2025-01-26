import connectDB from "./DB/connection.js";
import collectionRouter from "./modules/collection/collection.controller.js";
import booksRouter from "./modules/books/books.controller.js";
import logsRouter from "./modules/logs/logs.controller.js";

const bootstrap = async (app, express) => {
  // connect db
  await connectDB();

  // parse request
  app.use(express.json());

  // control collection requests
  app.use("/collection", collectionRouter);

  // control books request
  app.use("/books", booksRouter);

  // control logs request
  app.use("/logs", logsRouter);

  // not found routes
  app.all("*", (req, res) => {
    return res.status(404).json({ success: false, message: "page not found" });
  });
};

export default bootstrap;
