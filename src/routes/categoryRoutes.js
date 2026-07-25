import express from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = express.Router();

/**
 * Category List
 */
router.get("/", categoryController.buildCategoryList);

/**
 * Create Category
 */
router.get("/new-category", categoryController.buildNewCategory);
router.post("/new-category", categoryController.addCategory);

/**
 * Edit Category
 */
router.get("/edit-category/:id", categoryController.buildEditCategory);
router.post("/edit-category/:id", categoryController.editCategory);

/**
 * Category Details
 */
router.get("/:id", categoryController.buildCategoryDetail);

export default router;