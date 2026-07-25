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
            address: "",
            phone: "",
            email: ""
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
        address,
        phone,
        email
    } = req.body;


    const errors = [];


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
        address,
        phone,
        email
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
        address,
        phone,
        email
    } = req.body;


    const errors = [];


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


    if (errors.length > 0) {

        return res.render("edit-organization", {
            title: "Edit Organization",
            errors,
            organization: {
                organization_id: req.params.id,
                ...req.body
            }
        });

    }


    await updateOrganization(
        req.params.id,
        name,
        description,
        address,
        phone,
        email
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