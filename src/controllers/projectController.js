import {
    getAllProjects,
    getProjectById,
    getCategoriesByProject,
    createProject,
    updateProject
} from "../models/projects.js";

import {
    getAllOrganizations
} from "../models/organizations.js";


/**
 * Display all projects
 */
const buildProjectList = async (req, res) => {

    try {

        const projects = await getAllProjects();

        res.render("projects", {
            title: "Projects",
            projects
        });

    } catch (error) {

        console.error("Error loading projects:", error);

        res.status(500).render("500", {
            title: "500 - Server Error"
        });

    }

};


/**
 * Display project details
 */
const buildProjectDetail = async (req, res) => {

    try {

        const projectId = req.params.id;

        const project = await getProjectById(projectId);

        if (!project) {

            return res.status(404).render("404", {
                title: "Project Not Found"
            });

        }

        const categories =
            await getCategoriesByProject(projectId);

        res.render("project-details", {
            title: project.name,
            project,
            categories
        });

    } catch (error) {

        console.error(
            "Error loading project details:",
            error
        );

        res.status(500).render("500", {
            title: "500 - Server Error"
        });

    }

};


/**
 * Display Create Project Form
 *
 * Admin only
 */
const buildNewProject = async (req, res) => {

    try {

        const organizations =
            await getAllOrganizations();

        res.render("new-project", {

            title: "Create Project",

            errors: [],

            organizations,

            project: {
                name: "",
                description: "",
                organization_id: ""
            }

        });

    } catch (error) {

        console.error(
            "Error loading create project page:",
            error
        );

        res.status(500).render("500", {
            title: "500 - Server Error"
        });

    }

};


/**
 * Process Create Project
 *
 * Admin only
 */
const addProject = async (req, res) => {

    const {
        name,
        description,
        organization_id
    } = req.body;


    const errors = [];


    const cleanName = name
        ? name.trim()
        : "";

    const cleanDescription = description
        ? description.trim()
        : "";


    /*
    =====================================
    VALIDATION
    =====================================
    */


    if (
        !cleanName ||
        cleanName.length < 3
    ) {

        errors.push({
            msg: "Project name must be at least 3 characters."
        });

    }


    if (cleanName.length > 100) {

        errors.push({
            msg: "Project name cannot exceed 100 characters."
        });

    }


    if (!organization_id) {

        errors.push({
            msg: "Please select an organization."
        });

    }


    /*
    =====================================
    RETURN FORM IF VALIDATION FAILS
    =====================================
    */

    if (errors.length > 0) {

        try {

            const organizations =
                await getAllOrganizations();

            return res.render("new-project", {

                title: "Create Project",

                errors,

                organizations,

                project: {
                    name: cleanName,
                    description: cleanDescription,
                    organization_id
                }

            });

        } catch (error) {

            console.error(
                "Error loading organizations:",
                error
            );

            return res.status(500).render("500", {
                title: "500 - Server Error"
            });

        }

    }


    /*
    =====================================
    CREATE PROJECT
    =====================================
    */

    try {

        await createProject(
            cleanName,
            cleanDescription,
            organization_id
        );


        /*
        =================================
        SUCCESS FLASH MESSAGE
        =================================
        */

        if (req.flash) {

            req.flash(
                "success",
                "Project created successfully."
            );

        }


        res.redirect("/projects");

    } catch (error) {

        console.error(
            "Error creating project:",
            error
        );


        /*
        =================================
        DATABASE ERROR
        =================================
        */

        try {

            const organizations =
                await getAllOrganizations();

            return res.status(500).render(
                "new-project",
                {

                    title: "Create Project",

                    errors: [
                        {
                            msg:
                                "Unable to create the project. Please try again."
                        }
                    ],

                    organizations,

                    project: {
                        name: cleanName,
                        description: cleanDescription,
                        organization_id
                    }

                }
            );

        } catch (renderError) {

            console.error(
                "Error rendering create project:",
                renderError
            );

            return res.status(500).render("500", {
                title: "500 - Server Error"
            });

        }

    }

};


/**
 * Display Edit Project Form
 *
 * Admin only
 */
const buildEditProject = async (req, res) => {

    try {

        const project =
            await getProjectById(req.params.id);


        if (!project) {

            return res.status(404).render("404", {
                title: "Project Not Found"
            });

        }


        const organizations =
            await getAllOrganizations();


        res.render("edit-project", {

            title: "Edit Project",

            errors: [],

            project,

            organizations

        });

    } catch (error) {

        console.error(
            "Error loading edit project page:",
            error
        );

        res.status(500).render("500", {
            title: "500 - Server Error"
        });

    }

};


/**
 * Process Edit Project
 *
 * Admin only
 */
const editProject = async (req, res) => {

    const {
        name,
        description,
        organization_id
    } = req.body;


    const errors = [];


    const cleanName = name
        ? name.trim()
        : "";

    const cleanDescription = description
        ? description.trim()
        : "";


    /*
    =====================================
    VALIDATION
    =====================================
    */


    if (
        !cleanName ||
        cleanName.length < 3
    ) {

        errors.push({
            msg: "Project name must be at least 3 characters."
        });

    }


    if (cleanName.length > 100) {

        errors.push({
            msg: "Project name cannot exceed 100 characters."
        });

    }


    if (!organization_id) {

        errors.push({
            msg: "Please select an organization."
        });

    }


    /*
    =====================================
    RETURN FORM IF VALIDATION FAILS
    =====================================
    */

    if (errors.length > 0) {

        try {

            const organizations =
                await getAllOrganizations();

            return res.render("edit-project", {

                title: "Edit Project",

                errors,

                organizations,

                project: {

                    project_id: req.params.id,

                    name: cleanName,

                    description: cleanDescription,

                    organization_id

                }

            });

        } catch (error) {

            console.error(
                "Error loading organizations:",
                error
            );

            return res.status(500).render("500", {
                title: "500 - Server Error"
            });

        }

    }


    /*
    =====================================
    UPDATE PROJECT
    =====================================
    */

    try {

        await updateProject(

            req.params.id,

            cleanName,

            cleanDescription,

            organization_id

        );


        /*
        =================================
        SUCCESS FLASH MESSAGE
        =================================
        */

        if (req.flash) {

            req.flash(
                "success",
                "Project updated successfully."
            );

        }


        res.redirect("/projects");

    } catch (error) {

        console.error(
            "Error updating project:",
            error
        );


        try {

            const organizations =
                await getAllOrganizations();


            return res.status(500).render(
                "edit-project",
                {

                    title: "Edit Project",

                    errors: [
                        {
                            msg:
                                "Unable to update the project. Please try again."
                        }
                    ],

                    organizations,

                    project: {

                        project_id:
                            req.params.id,

                        name: cleanName,

                        description:
                            cleanDescription,

                        organization_id

                    }

                }
            );

        } catch (renderError) {

            console.error(
                "Error rendering edit project:",
                renderError
            );

            return res.status(500).render("500", {
                title: "500 - Server Error"
            });

        }

    }

};


export {

    buildProjectList,

    buildProjectDetail,

    buildNewProject,

    addProject,

    buildEditProject,

    editProject

};