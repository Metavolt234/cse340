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
            address,
            phone,
            email
        FROM organization
        ORDER BY name;
    `;

    const result = await db.query(sql);

    return result.rows;
};


/**
 * Get organization by ID
 */
const getOrganizationById = async (organizationId) => {

    const sql = `
        SELECT
            organization_id,
            name,
            description,
            address,
            phone,
            email
        FROM organization
        WHERE organization_id = $1;
    `;

    const result = await db.query(sql, [organizationId]);

    return result.rows[0];
};


/**
 * Get projects belonging to an organization
 */
const getProjectsByOrganization = async (organizationId) => {

    const sql = `
        SELECT
            project_id,
            name,
            description
        FROM service_project
        WHERE organization_id = $1
        ORDER BY name;
    `;

    const result = await db.query(sql, [organizationId]);

    return result.rows;
};


/**
 * Create new organization
 */
const createOrganization = async (
    name,
    description,
    address,
    phone,
    email
) => {

    const sql = `
        INSERT INTO organization
        (
            name,
            description,
            address,
            phone,
            email
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *;
    `;

    const result = await db.query(sql, [
        name,
        description,
        address,
        phone,
        email
    ]);

    return result.rows[0];
};


/**
 * Update organization
 */
const updateOrganization = async (
    organizationId,
    name,
    description,
    address,
    phone,
    email
) => {

    const sql = `
        UPDATE organization
        SET
            name = $1,
            description = $2,
            address = $3,
            phone = $4,
            email = $5
        WHERE organization_id = $6
        RETURNING *;
    `;

    const result = await db.query(sql, [
        name,
        description,
        address,
        phone,
        email,
        organizationId
    ]);

    return result.rows[0];
};


export {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganization,
    createOrganization,
    updateOrganization
};