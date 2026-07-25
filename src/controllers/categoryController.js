import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory,
    createCategory,
    updateCategory
} from "../models/categories.js";

/**
 * Display all categories
 */
const buildCategoryList = async (req, res) => {
    const categories = await getAllCategories();

    res.render("categories", {
        title: "Categories",
        categories
    });
};

/**
 * Display category details
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

/**
 * Build Create Category View
 */
const buildNewCategory = (req, res) => {

    res.render("new-category", {
        title: "Create Category",
        errors: [],
        categoryName: ""
    });

};

/**
 * Save Category
 */
const addCategory = async (req, res) => {

    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim().length < 3 || categoryName.length > 100) {

        return res.render("new-category", {
            title: "Create Category",
            errors: [{
                msg: "Category name must be between 3 and 100 characters."
            }],
            categoryName
        });

    }

    await createCategory(categoryName);

    res.redirect("/categories");

};

/**
 * Build Edit Category View
 */
const buildEditCategory = async (req, res) => {

    const category = await getCategoryById(req.params.id);

    res.render("edit-category", {
        title: "Edit Category",
        errors: [],
        category
    });

};

/**
 * Update Category
 */
const editCategory = async (req, res) => {

    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim().length < 3 || categoryName.length > 100) {

        return res.render("edit-category", {
            title: "Edit Category",
            errors: [{
                msg: "Category name must be between 3 and 100 characters."
            }],
            category: {
                category_id: req.params.id,
                name: categoryName
            }
        });

    }

    await updateCategory(req.params.id, categoryName);

    res.redirect("/categories");

};

export {
    buildCategoryList,
    buildCategoryDetail,
    buildNewCategory,
    addCategory,
    buildEditCategory,
    editCategory
};