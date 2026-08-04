import express from "express";

const router = express.Router();

import * as organizationController
    from "../controllers/organizationController.js";

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";



/**
 * =========================================
 * PUBLIC ORGANIZATION ROUTES
 * =========================================
 */


/**
 * Organization List
 * GET /organizations
 */
router.get(
    "/",
    organizationController.buildOrganizationList
);


/**
 * Organization Details
 * GET /organizations/:id
 */
router.get(
    "/:id",
    organizationController.buildOrganizationDetail
);



/**
 * =========================================
 * ADMIN ORGANIZATION ROUTES
 * =========================================
 */


/**
 * Create Organization Form
 * GET /organizations/new-organization
 */
router.get(
    "/new-organization",
    requireLogin,
    requireRole("admin"),
    organizationController.buildNewOrganization
);


/**
 * Process Create Organization
 * POST /organizations/new-organization
 */
router.post(
    "/new-organization",
    requireLogin,
    requireRole("admin"),
    organizationController.addOrganization
);


/**
 * Edit Organization Form
 * GET /organizations/edit-organization/:id
 */
router.get(
    "/edit-organization/:id",
    requireLogin,
    requireRole("admin"),
    organizationController.buildEditOrganization
);


/**
 * Process Edit Organization
 * POST /organizations/edit-organization/:id
 */
router.post(
    "/edit-organization/:id",
    requireLogin,
    requireRole("admin"),
    organizationController.editOrganization
);


export default router;

