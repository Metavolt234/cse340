import {
    getAllProjects,
    getProjectById,
    getCategoriesByProject
} from "../models/projects.js";

/**
 * Display all service projects
 */
const buildProjectList = async (req, res) => {

    const projects = await getAllProjects();

    res.render("projects", {
        title: "Service Projects",
        projects
    });

};

/**
 * Display one project
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

export {
    buildProjectList,
    buildProjectDetail
};