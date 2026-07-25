import express from "express";
import {
    buildCategoryList,
    buildCategoryDetail
} from "../controllers/categoryController.js";

const router = express.Router();

// List all categories
router.get("/", buildCategoryList);

// Category details page
router.get("/:id", buildCategoryDetail);

export default router;