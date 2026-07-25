import db from './db.js';

/**
 * Get all categories
 */
const getAllCategories = async () => {

    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Get one category by ID
 */
const getCategoryById = async (categoryId) => {

    const query = `
        SELECT *
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows[0];
};

/**
 * Get all projects for a category
 */
const getProjectsByCategory = async (categoryId) => {

    const query = `
        SELECT
            sp.project_id,
            sp.name,
            sp.description
        FROM service_project sp
        JOIN project_category pc
            ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.name;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory
};