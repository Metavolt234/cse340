import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganization
} from "../models/organizations.js";

/**
 * Display all organizations
 */
const buildOrganizationList = async (req, res) => {

    const organizations = await getAllOrganizations();

    res.render("organizations", {
        title: "Partner Organizations",
        organizations
    });

};

/**
 * Display one organization
 */
const buildOrganizationDetail = async (req, res) => {

    const organizationId = req.params.id;

    const organization = await getOrganizationById(organizationId);

    const projects = await getProjectsByOrganization(organizationId);

    res.render("organization-details", {
        title: organization.name,
        organization,
        projects
    });

};

export {
    buildOrganizationList,
    buildOrganizationDetail
};