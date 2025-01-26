import { Router } from "express";
import * as logsService from "./logs.service.js";

const router = Router();

router.post("/", logsService.addLog);

export default router;
