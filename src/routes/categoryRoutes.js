import express from "express";

import * as categoryController
    from "../controllers/categoryController.js";

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";


const router = express.Router();


/*
=========================================
ADMIN CATEGORY ROUTES
=========================================
*/


// Display Create Category Form
router.get(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    categoryController.buildNewCategory
);


// Process Create Category Form
router.post(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    categoryController.addCategory
);


// Display Edit Category Form
router.get(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    categoryController.buildEditCategory
);


// Process Edit Category Form
router.post(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    categoryController.editCategory
);


/*
=========================================
PUBLIC CATEGORY ROUTES
=========================================
*/


// Display all categories
router.get(
    "/",
    categoryController.buildCategoryList
);


// Display category details
router.get(
    "/:id",
    categoryController.buildCategoryDetail
);


export default router;