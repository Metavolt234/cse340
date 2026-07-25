import db from './db.js';

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
 * Get all categories for a project
 */
const getCategoriesByProject = async (projectId) => {

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
    ORDER BY sp.project_id
    LIMIT 5;
`;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

export {
    getAllProjects,
    getProjectById,
    getCategoriesByProject
};