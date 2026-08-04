import db from "./db.js";


/**
 * Get all organizations
 */
const getAllOrganizations = async () => {

    const sql = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        ORDER BY name;
    `;


    try {

        const result =
            await db.query(sql);


        return result.rows;

    } catch (error) {

        console.error(
            "DATABASE ERROR - getAllOrganizations:"
        );

        console.error(error);

        throw error;
    }
};


/**
 * Get organization by ID
 */
const getOrganizationById = async (
    organizationId
) => {

    const sql = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;


    try {

        const result =
            await db.query(
                sql,
                [organizationId]
            );


        return result.rows[0] || null;

    } catch (error) {

        console.error(
            "DATABASE ERROR - getOrganizationById:"
        );

        console.error(error);

        throw error;
    }
};


/**
 * Get projects belonging to organization
 */
const getProjectsByOrganization = async (
    organizationId
) => {

    const sql = `
        SELECT
            project_id,
            name,
            description
        FROM service_project
        WHERE organization_id = $1
        ORDER BY name;
    `;


    try {

        const result =
            await db.query(
                sql,
                [organizationId]
            );


        return result.rows;

    } catch (error) {

        console.error(
            "DATABASE ERROR - getProjectsByOrganization:"
        );

        console.error(error);

        throw error;
    }
};


/**
 * Create organization
 */
const createOrganization = async (

    name,

    description,

    contact_email,

    logo_filename

) => {

    const sql = `

        INSERT INTO organization
        (
            name,
            description,
            contact_email,
            logo_filename
        )

        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )

        RETURNING *;

    `;


    try {

        const result =
            await db.query(
                sql,
                [
                    name,
                    description,
                    contact_email,
                    logo_filename
                ]
            );


        return result.rows[0];

    } catch (error) {

        console.error(
            "DATABASE ERROR - createOrganization:"
        );

        console.error(error);

        throw error;
    }
};


/**
 * Update organization
 */
const updateOrganization = async (

    organizationId,

    name,

    description,

    contact_email,

    logo_filename

) => {

    const sql = `

        UPDATE organization

        SET

            name = $1,

            description = $2,

            contact_email = $3,

            logo_filename = $4

        WHERE organization_id = $5

        RETURNING *;

    `;


    try {

        const result =
            await db.query(
                sql,
                [
                    name,
                    description,
                    contact_email,
                    logo_filename,
                    organizationId
                ]
            );


        return result.rows[0];

    } catch (error) {

        console.error(
            "DATABASE ERROR - updateOrganization:"
        );

        console.error(error);

        throw error;
    }
};


export {

    getAllOrganizations,

    getOrganizationById,

    getProjectsByOrganization,

    createOrganization,

    updateOrganization

};