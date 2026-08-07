import db from "./db.js";


/**
 * Add a user as a volunteer for a project
 */
const addVolunteer = async (userId, projectId) => {

    const query = `
        INSERT INTO project_volunteer
        (
            user_id,
            project_id
        )
        VALUES
        ($1, $2)
        ON CONFLICT (user_id, project_id)
        DO NOTHING
        RETURNING *;
    `;

    const result = await db.query(
        query,
        [
            userId,
            projectId
        ]
    );

    return result.rows[0] || null;
};


/**
 * Remove a user from a project
 */
const removeVolunteer = async (userId, projectId) => {

    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1
        AND project_id = $2
        RETURNING *;
    `;

    const result = await db.query(
        query,
        [
            userId,
            projectId
        ]
    );

    return result.rows[0] || null;
};


/**
 * Get all projects a user has volunteered for
 */
const getProjectsByUser = async (userId) => {

    const query = `
        SELECT
            sp.project_id,
            sp.name,
            sp.description,
            o.organization_id,
            o.name AS organization_name
        FROM project_volunteer pv
        JOIN service_project sp
            ON pv.project_id = sp.project_id
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.name;
    `;

    const result = await db.query(
        query,
        [userId]
    );

    return result.rows;
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

    const result = await db.query(
        query,
        [
            userId,
            projectId
        ]
    );

    return result.rows.length > 0;
};


export {
    addVolunteer,
    removeVolunteer,
    getProjectsByUser,
    isUserVolunteer
};