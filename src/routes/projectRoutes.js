import express from "express";

const router = express.Router();

import * as projectController from "../controllers/projectController.js";


/**
 * Project List
 * GET /projects
 */
router.get(
    "/",
    projectController.buildProjectList
);



/**
 * Create Project
 * GET /projects/new-project
 */
router.get(
    "/new-project",
    projectController.buildNewProject
);



/**
 * Process Create Project
 * POST /projects/new-project
 */
router.post(
    "/new-project",
    projectController.addProject
);



/**
 * Edit Project
 * GET /projects/edit-project/:id
 */
router.get(
    "/edit-project/:id",
    projectController.buildEditProject
);



/**
 * Process Edit Project
 * POST /projects/edit-project/:id
 */
router.post(
    "/edit-project/:id",
    projectController.editProject
);



/**
 * Project Details
 * GET /projects/:id
 */
router.get(
    "/:id",
    projectController.buildProjectDetail
);



export default router;