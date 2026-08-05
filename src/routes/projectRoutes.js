import express from "express";

const router = express.Router();

import * as projectController
    from "../controllers/projectController.js";

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";


/**
 * Project List
 * GET /projects
 */
router.get(
    "/",
    projectController.buildProjectList
);


/**
 * Create Project Form
 * GET /projects/new-project
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
 */
router.post(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    projectController.addProject
);


/**
 * Edit Project Form
 * GET /projects/edit-project/:id
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
 */
router.post(
    "/edit-project/:id",
    requireLogin,
    requireRole("admin"),
    projectController.editProject
);


/**
 * Project Details
 *
 * IMPORTANT:
 * Keep this AFTER the named routes.
 */
router.get(
    "/:id",
    projectController.buildProjectDetail
);


export default router;