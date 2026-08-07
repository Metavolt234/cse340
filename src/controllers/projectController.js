
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

import {
    addVolunteer,
    removeVolunteer,
    isUserVolunteer
} from "../models/volunteers.js";


/* =========================================
   DISPLAY ALL PROJECTS
   GET /projects
========================================= */

const buildProjectList = async (req, res) => {

    try {

        const projects =
            await getAllProjects();


        const isLoggedIn =
            !!(
                req.session &&
                req.session.user
            );


        res.render(
            "projects",
            {

                title: "Projects",

                projects,

                isLoggedIn,

                user:
                    req.session?.user || null

            }
        );

    } catch (error) {

        console.error(
            "ERROR - buildProjectList:",
            error
        );

        throw error;

    }

};


/* =========================================
   DISPLAY PROJECT DETAILS
   GET /projects/:id
========================================= */

const buildProjectDetail = async (req, res) => {

    try {

        const projectId = req.params.id;

        const project =
            await getProjectById(projectId);

        if (!project) {

            return res.status(404).render(
                "404",
                {
                    title: "Project Not Found"
                }
            );
        }

        const categories =
            await getCategoriesByProject(projectId);

        let isVolunteer = false;

        const isLoggedIn =
            Boolean(
                req.session &&
                req.session.user
            );

        if (isLoggedIn) {

            const userId =
                req.session.user.user_id;

            isVolunteer =
                await isUserVolunteer(
                    userId,
                    projectId
                );
        }

        return res.render(
            "project-details",
            {
                title: project.name,
                project,
                categories,
                isVolunteer,
                isLoggedIn
            }
        );

    } catch (error) {

        console.error(
            "ERROR - buildProjectDetail:",
            error
        );

        return res.status(500).render(
            "500",
            {
                title: "500 - Server Error"
            }
        );
    }
};


/* =========================================
   DISPLAY NEW PROJECT FORM
   GET /projects/new-project
========================================= */

const buildNewProject = async (req, res) => {

    try {

        const organizations =
            await getAllOrganizations();

        return res.render(
            "new-project",
            {
                title: "Create Project",
                errors: [],
                organizations,
                project: {
                    name: "",
                    description: "",
                    organization_id: ""
                }
            }
        );

    } catch (error) {

        console.error(
            "ERROR - buildNewProject:",
            error
        );

        return res.status(500).render(
            "500",
            {
                title: "500 - Server Error"
            }
        );
    }
};


/* =========================================
   PROCESS NEW PROJECT
   POST /projects/new-project
========================================= */

const addProject = async (req, res) => {

    try {

        const {
            name,
            description,
            organization_id
        } = req.body;

        const errors = [];

        if (
            !name ||
            name.trim().length < 3
        ) {

            errors.push({
                msg: "Project name must be at least 3 characters."
            });
        }

        if (
            name &&
            name.trim().length > 150
        ) {

            errors.push({
                msg: "Project name cannot exceed 150 characters."
            });
        }

        if (
            !description ||
            description.trim().length < 10
        ) {

            errors.push({
                msg: "Project description must be at least 10 characters."
            });
        }

        if (!organization_id) {

            errors.push({
                msg: "Please select an organization."
            });
        }

        if (errors.length > 0) {

            const organizations =
                await getAllOrganizations();

            return res.status(400).render(
                "new-project",
                {
                    title: "Create Project",
                    errors,
                    organizations,
                    project: req.body
                }
            );
        }

        await createProject(
            name.trim(),
            description.trim(),
            organization_id
        );

        req.flash(
            "success",
            "Project created successfully."
        );

        return res.redirect(
            "/projects"
        );

    } catch (error) {

        console.error(
            "ERROR - addProject:",
            error
        );

        return res.status(500).render(
            "500",
            {
                title: "500 - Server Error"
            }
        );
    }
};


/* =========================================
   DISPLAY EDIT PROJECT FORM
   GET /projects/edit-project/:id
========================================= */

const buildEditProject = async (req, res) => {

    try {

        const project =
            await getProjectById(
                req.params.id
            );

        if (!project) {

            return res.status(404).render(
                "404",
                {
                    title: "Project Not Found"
                }
            );
        }

        const organizations =
            await getAllOrganizations();

        return res.render(
            "edit-project",
            {
                title: "Edit Project",
                errors: [],
                project,
                organizations
            }
        );

    } catch (error) {

        console.error(
            "ERROR - buildEditProject:",
            error
        );

        return res.status(500).render(
            "500",
            {
                title: "500 - Server Error"
            }
        );
    }
};


/* =========================================
   PROCESS EDIT PROJECT
   POST /projects/edit-project/:id
========================================= */

const editProject = async (req, res) => {

    try {

        const {
            name,
            description,
            organization_id
        } = req.body;

        const errors = [];

        if (
            !name ||
            name.trim().length < 3
        ) {

            errors.push({
                msg: "Project name must be at least 3 characters."
            });
        }

        if (
            name &&
            name.trim().length > 150
        ) {

            errors.push({
                msg: "Project name cannot exceed 150 characters."
            });
        }

        if (
            !description ||
            description.trim().length < 10
        ) {

            errors.push({
                msg: "Project description must be at least 10 characters."
            });
        }

        if (!organization_id) {

            errors.push({
                msg: "Please select an organization."
            });
        }

        if (errors.length > 0) {

            const organizations =
                await getAllOrganizations();

            return res.status(400).render(
                "edit-project",
                {
                    title: "Edit Project",
                    errors,
                    organizations,
                    project: {
                        project_id: req.params.id,
                        ...req.body
                    }
                }
            );
        }

        await updateProject(
            req.params.id,
            name.trim(),
            description.trim(),
            organization_id
        );

        req.flash(
            "success",
            "Project updated successfully."
        );

        return res.redirect(
            "/projects"
        );

    } catch (error) {

        console.error(
            "ERROR - editProject:",
            error
        );

        return res.status(500).render(
            "500",
            {
                title: "500 - Server Error"
            }
        );
    }
};


/* =========================================
   VOLUNTEER FOR PROJECT
   POST /projects/:id/volunteer
========================================= */

const volunteerForProject = async (req, res) => {

    try {

        const projectId =
            req.params.id;

        const userId =
            req.session.user.user_id;

        const project =
            await getProjectById(projectId);

        if (!project) {

            req.flash(
                "error",
                "The project could not be found."
            );

            return res.redirect(
                "/projects"
            );
        }

        await addVolunteer(
            userId,
            projectId
        );

        req.flash(
            "success",
            `You are now volunteering for "${project.name}".`
        );

        return res.redirect(
            `/projects/${projectId}`
        );

    } catch (error) {

        console.error(
            "ERROR - volunteerForProject:",
            error
        );

        return res.status(500).render(
            "500",
            {
                title: "500 - Server Error"
            }
        );
    }
};


/* =========================================
   REMOVE VOLUNTEER
   POST /projects/:id/remove-volunteer
========================================= */

const removeVolunteerFromProject =
    async (req, res) => {

        try {

            const projectId =
                req.params.id;

            const userId =
                req.session.user.user_id;

            const project =
                await getProjectById(projectId);

            if (!project) {

                req.flash(
                    "error",
                    "The project could not be found."
                );

                return res.redirect(
                    "/projects"
                );
            }

            await removeVolunteer(
                userId,
                projectId
            );

            req.flash(
                "success",
                `You are no longer volunteering for "${project.name}".`
            );

            return res.redirect(
                `/projects/${projectId}`
            );

        } catch (error) {

            console.error(
                "ERROR - removeVolunteer:",
                error
            );

            return res.status(500).render(
                "500",
                {
                    title: "500 - Server Error"
                }
            );
        }
    };


/* =========================================
   EXPORT CONTROLLERS
========================================= */

export {
    buildProjectList,
    buildProjectDetail,
    buildNewProject,
    addProject,
    buildEditProject,
    editProject,
    volunteerForProject,
    removeVolunteerFromProject
};

