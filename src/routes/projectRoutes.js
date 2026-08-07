import express from "express";

const router = express.Router();


// ========================================
// CONTROLLERS
// ========================================

import * as projectController
    from "../controllers/projectController.js";


// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

import {
    requireLogin
} from "../middleware/auth.js";


// ========================================
// PROJECT LIST
// GET /projects
// ========================================

router.get(
    "/",
    projectController.buildProjectList
);


// ========================================
// NEW PROJECT FORM
// GET /projects/new-project
// ========================================

router.get(
    "/new-project",
    requireLogin,
    projectController.buildNewProject
);


// ========================================
// CREATE PROJECT
// POST /projects/new-project
// ========================================

router.post(
    "/new-project",
    requireLogin,
    projectController.addProject
);


// ========================================
// EDIT PROJECT FORM
// GET /projects/edit-project/:id
// ========================================

router.get(
    "/edit-project/:id",
    requireLogin,
    projectController.buildEditProject
);


// ========================================
// UPDATE PROJECT
// POST /projects/edit-project/:id
// ========================================

router.post(
    "/edit-project/:id",
    requireLogin,
    projectController.editProject
);


// ========================================
// VOLUNTEER FOR PROJECT
// POST /projects/:id/volunteer
// ========================================

router.post(
    "/:id/volunteer",
    requireLogin,
    projectController.volunteerForProject
);


// ========================================
// REMOVE VOLUNTEER
// POST /projects/:id/remove-volunteer
// ========================================

router.post(
    "/:id/remove-volunteer",
    requireLogin,
    projectController.removeVolunteerFromProject
);

// ========================================
// PROJECT DETAILS
// GET /projects/:id
// ========================================

router.get(
    "/:id",
    projectController.buildProjectDetail
);


export default router;