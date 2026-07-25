import db from "./db.js";


/**
 * Get all projects
 */
const getAllProjects = async () => {

    const query = `
        SELECT
            project_id,
            name,
            description
        FROM service_project
        ORDER BY project_id;
    `;

    const result = await db.query(query);

    return result.rows;
};


/**
 * Get one project by ID
 */
const getProjectById = async (projectId) => {

    const query = `
        SELECT
            sp.project_id,
            sp.name,
            sp.description,
            o.organization_id,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows[0];
};


/**
 * Get categories for a project
 */
const getCategoriesByProject = async (projectId) => {

    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};


/**
 * Create a new service project
 */
const createProject = async (
    name,
    description,
    organizationId
) => {

    const query = `
        INSERT INTO service_project
        (
            name,
            description,
            organization_id
        )
        VALUES
        ($1,$2,$3)
        RETURNING *;
    `;

    const result = await db.query(query, [
        name,
        description,
        organizationId
    ]);

    return result.rows[0];
};


/**
 * Update service project
 */
const updateProject = async (
    projectId,
    name,
    description,
    organizationId
) => {

    const query = `
        UPDATE service_project
        SET
            name = $1,
            description = $2,
            organization_id = $3
        WHERE project_id = $4
        RETURNING *;
    `;


    const result = await db.query(query, [
        name,
        description,
        organizationId,
        projectId
    ]);

    return result.rows[0];
};


export {
    getAllProjects,
    getProjectById,
    getCategoriesByProject,
    createProject,
    updateProject
};