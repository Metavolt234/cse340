
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

    const result =
        await db.query(query);

    return result.rows;
};


/**
 * Get one project by ID
 */
const getProjectById = async (
    projectId
) => {

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

    const result =
        await db.query(
            query,
            [projectId]
        );

    return result.rows[0];
};


/**
 * Get categories for a project
 */
const getCategoriesByProject = async (
    projectId
) => {

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

    const result =
        await db.query(
            query,
            [projectId]
        );

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
        (
            $1,
            $2,
            $3
        )
        RETURNING *;
    `;

    const result =
        await db.query(
            query,
            [
                name,
                description,
                organizationId
            ]
        );

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

    const result =
        await db.query(
            query,
            [
                name,
                description,
                organizationId,
                projectId
            ]
        );

    return result.rows[0];
};


/* =========================================
   WEEK 6 - VOLUNTEERS
========================================= */


/**
 * Add a user as a volunteer for a project
 */
const addVolunteer = async (
    userId,
    projectId
) => {

    const query = `
        INSERT INTO project_volunteer
        (
            user_id,
            project_id
        )
        VALUES
        (
            $1,
            $2
        )
        ON CONFLICT (
            user_id,
            project_id
        )
        DO NOTHING
        RETURNING *;
    `;

    const result =
        await db.query(
            query,
            [
                userId,
                projectId
            ]
        );

    return result.rows[0];
};


/**
 * Remove a user as a volunteer
 */
const removeVolunteer = async (
    userId,
    projectId
) => {

    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1
        AND project_id = $2
        RETURNING *;
    `;

    const result =
        await db.query(
            query,
            [
                userId,
                projectId
            ]
        );

    return result.rows[0];
};


/**
 * Check whether a user is volunteering
 * for a specific project
 */
const isUserVolunteer = async (
    userId,
    projectId
) => {

    const query = `
        SELECT
            user_id,
            project_id
        FROM project_volunteer
        WHERE user_id = $1
        AND project_id = $2;
    `;

    const result =
        await db.query(
            query,
            [
                userId,
                projectId
            ]
        );

    return result.rows.length > 0;
};


/**
 * Get all projects a user has
 * volunteered for
 */
const getProjectsByVolunteer = async (
    userId
) => {

    const query = `
        SELECT
            sp.project_id,
            sp.name,
            sp.description,
            o.name AS organization_name
        FROM project_volunteer pv
        JOIN service_project sp
            ON pv.project_id = sp.project_id
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.name;
    `;

    const result =
        await db.query(
            query,
            [userId]
        );

    return result.rows;
};


/**
 * Export all project model functions
 */
export {

    getAllProjects,

    getProjectById,

    getCategoriesByProject,

    createProject,

    updateProject,

    addVolunteer,

    removeVolunteer,

    isUserVolunteer,

    getProjectsByVolunteer

};

