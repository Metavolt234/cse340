import express from "express";

import * as projectController
    from "../controllers/projectController.js";

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";


const router = express.Router();


/*
=========================================
PUBLIC PROJECT ROUTES
=========================================
*/


/**
 * Project List
 * GET /projects
 *
 * Public - anyone can view projects
 */
router.get(
    "/",
    projectController.buildProjectList
);


/**
 * Project Details
 * GET /projects/:id
 *
 * Public - anyone can view project details
 *
 * IMPORTANT:
 * This route is placed after /new-project
 * and /edit-project/:id so those routes
 * are matched correctly.
 */
router.get(
    "/:id",
    projectController.buildProjectDetail
);


/*
=========================================
ADMIN PROJECT ROUTES
=========================================
*/


/**
 * Create Project
 * GET /projects/new-project
 *
 * Admin only
 */
router.get(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    projectController.buildNewProject
);


/**
 * Process Create Project
 * POST /projects/new-project
 *
 * Admin only
 */
router.post(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    projectController.addProject
);


/**
 * Edit Project
 * GET /projects/edit-project/:id
 *
 * Admin only
 */
router.get(
    "/edit-project/:id",
    requireLogin,
    requireRole("admin"),
    projectController.buildEditProject
);


/**
 * Process Edit Project
 * POST /projects/edit-project/:id
 *
 * Admin only
 */
router.post(
    "/edit-project/:id",
    requireLogin,
    requireRole("admin"),
    projectController.editProject
);


export default router;