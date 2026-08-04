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
const buildOrganizationList = async (req, res, next) => {

    try {

        const organizations = await getAllOrganizations();

        res.render("organizations", {
            title: "Organizations",
            organizations
        });

    } catch (error) {

        console.error("ORGANIZATION LIST ERROR:");
        console.error(error);

        next(error);
    }
};


/**
 * Display organization details
 */
const buildOrganizationDetail = async (req, res, next) => {

    try {

        const organizationId = req.params.id;

        const organization =
            await getOrganizationById(organizationId);


        if (!organization) {

            return res.status(404).render("404", {
                title: "Organization Not Found"
            });

        }


        const projects =
            await getProjectsByOrganization(
                organizationId
            );


        res.render("organization-details", {

            title: organization.name,

            organization,

            projects

        });

    } catch (error) {

        console.error("ORGANIZATION DETAIL ERROR:");
        console.error(error);

        next(error);
    }
};


/**
 * Display Create Organization form
 */
const buildNewOrganization = (req, res, next) => {

    try {

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

    } catch (error) {

        console.error("NEW ORGANIZATION PAGE ERROR:");
        console.error(error);

        next(error);
    }
};


/**
 * Process Create Organization
 */
const addOrganization = async (req, res, next) => {

    try {

        const {
            name,
            description,
            contact_email,
            logo_filename
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


        req.flash(
            "success",
            "Organization created successfully."
        );


        res.redirect("/organizations");


    } catch (error) {

        console.error("CREATE ORGANIZATION ERROR:");
        console.error(error);

        next(error);
    }
};


/**
 * Display Edit Organization form
 */
const buildEditOrganization = async (req, res, next) => {

    try {

        const organization =
            await getOrganizationById(
                req.params.id
            );


        if (!organization) {

            return res.status(404).render("404", {

                title: "Organization Not Found"

            });

        }


        res.render("edit-organization", {

            title: "Edit Organization",

            errors: [],

            organization

        });

    } catch (error) {

        console.error("EDIT ORGANIZATION PAGE ERROR:");
        console.error(error);

        next(error);
    }
};


/**
 * Process Edit Organization
 */
const editOrganization = async (req, res, next) => {

    try {

        const {
            name,
            description,
            contact_email,
            logo_filename
        } = req.body;


        const errors = [];


        if (!name || name.trim().length < 3) {

            errors.push({

                msg:
                    "Organization name must be at least 3 characters."

            });

        }


        if (name && name.length > 100) {

            errors.push({

                msg:
                    "Organization name cannot exceed 100 characters."

            });

        }


        if (!description || description.trim() === "") {

            errors.push({

                msg:
                    "Description is required."

            });

        }


        if (!contact_email || contact_email.trim() === "") {

            errors.push({

                msg:
                    "Contact email is required."

            });

        }


        if (!logo_filename || logo_filename.trim() === "") {

            errors.push({

                msg:
                    "Logo filename is required."

            });

        }


        if (errors.length > 0) {

            return res.render(
                "edit-organization",
                {

                    title: "Edit Organization",

                    errors,

                    organization: {

                        organization_id:
                            req.params.id,

                        name,

                        description,

                        contact_email,

                        logo_filename

                    }

                }
            );

        }


        await updateOrganization(

            req.params.id,

            name,

            description,

            contact_email,

            logo_filename

        );


        req.flash(
            "success",
            "Organization updated successfully."
        );


        res.redirect("/organizations");


    } catch (error) {

        console.error("UPDATE ORGANIZATION ERROR:");
        console.error(error);

        next(error);
    }
};


export {

    buildOrganizationList,

    buildOrganizationDetail,

    buildNewOrganization,

    addOrganization,

    buildEditOrganization,

    editOrganization

};