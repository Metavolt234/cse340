import db from "./db.js";

/**
 * Get all categories
 */
const getAllCategories = async () => {

    const query = `
        SELECT
            category_id,
            name
        FROM category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Get one category
 */
const getCategoryById = async (categoryId) => {

    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows[0];
};

/**
 * Get all projects in a category
 */
const getProjectsByCategory = async (categoryId) => {

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
        JOIN project_category pc
            ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.name;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

/**
 * Create category
 */
const createCategory = async (name) => {

    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING *;
    `;

    const result = await db.query(query, [name]);

    return result.rows[0];
};

/**
 * Update category
 */
const updateCategory = async (categoryId, name) => {

    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING *;
    `;

    const result = await db.query(query, [name, categoryId]);

    return result.rows[0];
};

export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory,
    createCategory,
    updateCategory
}