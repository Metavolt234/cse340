import express from "express";

const router = express.Router();

import * as categoryController
    from "../controllers/categoryController.js";

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";


/* =====================================
   ADMIN CREATE
===================================== */

router.get(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    categoryController.buildNewCategory
);


router.post(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    categoryController.addCategory
);



/* =====================================
   ADMIN EDIT
===================================== */

router.get(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    categoryController.buildEditCategory
);


router.post(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    categoryController.editCategory
);



/* =====================================
   PUBLIC LIST
===================================== */

router.get(
    "/",
    categoryController.buildCategoryList
);



/* =====================================
   PUBLIC DETAILS
===================================== */

router.get(
    "/:id",
    categoryController.buildCategoryDetail
);


export default router;