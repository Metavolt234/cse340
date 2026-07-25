import express from "express";
import {
    buildOrganizationList,
    buildOrganizationDetail
} from "../controllers/organizationController.js";

const router = express.Router();

router.get("/", buildOrganizationList);

router.get("/:id", buildOrganizationDetail);

export default router;