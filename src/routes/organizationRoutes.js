import express from "express";

const router = express.Router();

import * as organizationController from "../controllers/organizationController.js";


/**
 * Organization List
 * GET /organizations
 */
router.get(
    "/",
    organizationController.buildOrganizationList
);


/**
 * Create Organization
 * GET /organizations/new-organization
 */
router.get(
    "/new-organization",
    organizationController.buildNewOrganization
);


/**
 * Process Create Organization
 * POST /organizations/new-organization
 */
router.post(
    "/new-organization",
    organizationController.addOrganization
);


/**
 * Edit Organization
 * GET /organizations/edit-organization/:id
 */
router.get(
    "/edit-organization/:id",
    organizationController.buildEditOrganization
);


/**
 * Process Edit Organization
 * POST /organizations/edit-organization/:id
 */
router.post(
    "/edit-organization/:id",
    organizationController.editOrganization
);


/**
 * Organization Details
 * GET /organizations/:id
 */
router.get(
    "/:id",
    organizationController.buildOrganizationDetail
);


export default router;