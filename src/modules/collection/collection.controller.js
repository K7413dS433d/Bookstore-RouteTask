import { Router } from "express";
import * as collectionService from "./collection.service.js";

const router = Router();

router.post("/books", collectionService.createBooksCol);

router.post("/books/index", collectionService.createBooksIdx);

router.post("/authors", collectionService.createAuthorCol);

router.post("/logs/capped", collectionService.createLogsCol);

export default router;
