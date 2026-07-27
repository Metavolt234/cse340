import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganization,
    createOrganization,
    updateOrganization
} from "../models/organizations.js";

/**
 * Display all organizations
 */
const buildOrganizationList = async (req, res) => {

    const organizations = await getAllOrganizations();

    res.render("organizations", {
        title: "Organizations",
        organizations
    });
};


/**
 * Display organization details
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


/**
 * Display Create Organization form
 */
const buildNewOrganization = (req, res) => {

    res.render("new-organization", {
        title: "Create Organization",
        errors: [],
        organization: {
            name: "",
            description: "",
            contact_email: "",
            logo_filename: ""
        }
    });

};


/**
 * Process Create Organization
 */
const addOrganization = async (req, res) => {

    const {
        name,
        description,
        contact_email,
        logo_filename
    } = req.body;

    const errors = [];

    // Server-side validation
    if (!name || name.trim().length < 3) {
        errors.push({
            msg: "Organization name must be at least 3 characters."
        });
    }

    if (name && name.length > 100) {
        errors.push({
            msg: "Organization name cannot exceed 100 characters."
        });
    }

    if (!description || description.trim() === "") {
        errors.push({
            msg: "Description is required."
        });
    }

    if (!contact_email || contact_email.trim() === "") {
        errors.push({
            msg: "Contact email is required."
        });
    }

    if (!logo_filename || logo_filename.trim() === "") {
        errors.push({
            msg: "Logo filename is required."
        });
    }

    if (errors.length > 0) {

        return res.render("new-organization", {
            title: "Create Organization",
            errors,
            organization: req.body
        });

    }

    await createOrganization(
        name,
        description,
        contact_email,
        logo_filename
    );

    res.redirect("/organizations");

};


/**
 * Display Edit Organization form
 */
const buildEditOrganization = async (req, res) => {

    const organization = await getOrganizationById(req.params.id);

    res.render("edit-organization", {
        title: "Edit Organization",
        errors: [],
        organization
    });

};


/**
 * Process Edit Organization
 */
const editOrganization = async (req, res) => {

    const {
        name,
        description,
        contact_email,
        logo_filename
    } = req.body;

    const errors = [];

    // Server-side validation
    if (!name || name.trim().length < 3) {
        errors.push({
            msg: "Organization name must be at least 3 characters."
        });
    }

    if (name && name.length > 100) {
        errors.push({
            msg: "Organization name cannot exceed 100 characters."
        });
    }

    if (!description || description.trim() === "") {
        errors.push({
            msg: "Description is required."
        });
    }

    if (!contact_email || contact_email.trim() === "") {
        errors.push({
            msg: "Contact email is required."
        });
    }

    if (!logo_filename || logo_filename.trim() === "") {
        errors.push({
            msg: "Logo filename is required."
        });
    }

    if (errors.length > 0) {

        return res.render("edit-organization", {
            title: "Edit Organization",
            errors,
            organization: {
                organization_id: req.params.id,
                name,
                description,
                contact_email,
                logo_filename
            }
        });

    }

    await updateOrganization(
        req.params.id,
        name,
        description,
        contact_email,
        logo_filename
    );

    res.redirect("/organizations");

};


export {
    buildOrganizationList,
    buildOrganizationDetail,
    buildNewOrganization,
    addOrganization,
    buildEditOrganization,
    editOrganization
};