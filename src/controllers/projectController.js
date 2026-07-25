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

    const projects = await getAllProjects();

    res.render("projects", {
        title: "Projects",
        projects
    });

};



/**
 * Display project details
 */
const buildProjectDetail = async (req, res) => {

    const projectId = req.params.id;


    const project = await getProjectById(projectId);


    const categories = await getCategoriesByProject(projectId);


    res.render("project-details", {
        title: project.name,
        project,
        categories
    });

};



/**
 * Display Create Project Form
 */
const buildNewProject = async (req, res) => {


    const organizations = await getAllOrganizations();


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

};



/**
 * Process Create Project
 */
const addProject = async (req, res) => {


    const {
        name,
        description,
        organization_id
    } = req.body;


    const errors = [];


    if (!name || name.trim().length < 3) {

        errors.push({
            msg: "Project name must be at least 3 characters."
        });

    }


    if (name && name.length > 100) {

        errors.push({
            msg: "Project name cannot exceed 100 characters."
        });

    }



    if (!organization_id) {

        errors.push({
            msg: "Please select an organization."
        });

    }



    if (errors.length > 0) {


        const organizations = await getAllOrganizations();


        return res.render("new-project", {

            title: "Create Project",

            errors,

            organizations,

            project: req.body

        });

    }



    await createProject(
        name,
        description,
        organization_id
    );



    res.redirect("/projects");

};



/**
 * Display Edit Project Form
 */
const buildEditProject = async (req, res) => {


    const project = await getProjectById(req.params.id);


    const organizations = await getAllOrganizations();



    res.render("edit-project", {

        title: "Edit Project",

        errors: [],

        project,

        organizations

    });


};



/**
 * Process Edit Project
 */
const editProject = async (req, res) => {


    const {
        name,
        description,
        organization_id
    } = req.body;



    const errors = [];



    if (!name || name.trim().length < 3) {

        errors.push({

            msg: "Project name must be at least 3 characters."

        });

    }



    if (name && name.length > 100) {

        errors.push({

            msg: "Project name cannot exceed 100 characters."

        });

    }



    if (!organization_id) {

        errors.push({

            msg: "Please select an organization."

        });

    }



    if (errors.length > 0) {


        const organizations = await getAllOrganizations();


        return res.render("edit-project", {

            title: "Edit Project",

            errors,

            organizations,

            project: {

                project_id: req.params.id,

                ...req.body

            }

        });

    }




    await updateProject(

        req.params.id,

        name,

        description,

        organization_id

    );



    res.redirect("/projects");

};



export {

    buildProjectList,

    buildProjectDetail,

    buildNewProject,

    addProject,

    buildEditProject,

    editProject

};