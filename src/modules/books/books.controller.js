import { Router } from "express";
import * as booksService from "./books.service.js";

const router = Router();

router.post("/", booksService.addBook);

router.post("/batch", booksService.addManyBooks);

router.patch("/:title", booksService.updateBook);

router.get("/title", booksService.findByTitle);

router.get("/year", booksService.findByDate);

router.get("/genre", booksService.findByGenre);

router.get("/skip-limit", booksService.skip_limit);

router.get("/year-integer", booksService.findByIntYear);

router.get("/exclude-genres", booksService.excludeGenres);

router.delete("/before-year", booksService.deleteBeforeDate);

router.get("/aggregate1", booksService.aggregate1);

router.get("/aggregate2", booksService.aggregate2);

router.get("/aggregate3", booksService.aggregate3);

router.get("/aggregate4", booksService.aggregate4);

export default router;
