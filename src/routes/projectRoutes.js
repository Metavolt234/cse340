import express from "express";
import {
    buildProjectList,
    buildProjectDetail
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", buildProjectList);

router.get("/:id", buildProjectDetail);

export default router;