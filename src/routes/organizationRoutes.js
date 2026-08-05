import express from "express";

const router = express.Router();

import * as organizationController
    from "../controllers/organizationController.js";

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";


/**
 * Organization List
 * GET /organizations
 */
router.get(
    "/",
    organizationController.buildOrganizationList
);


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


/**
 * Organization Details
 *
 * IMPORTANT:
 * This route must remain AFTER
 * all named routes above.
 */
router.get(
    "/:id",
    organizationController.buildOrganizationDetail
);


export default router;