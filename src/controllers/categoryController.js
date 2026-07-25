import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory
} from "../models/categories.js";

/**
 * Display all categories
 */
const buildCategoryList = async (req, res) => {

    const categories = await getAllCategories();

    res.render("categories", {
        title: "Service Categories",
        categories
    });

};

/**
 * Display one category and its projects
 */
const buildCategoryDetail = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    const projects = await getProjectsByCategory(categoryId);

    res.render("category-details", {
        title: category.name,
        category,
        projects
    });

};

export {
    buildCategoryList,
    buildCategoryDetail
};