import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory,
    createCategory,
    updateCategory
} from "../models/categories.js";


/* =========================================
   CATEGORY LIST
========================================= */

const buildCategoryList = async (
    req,
    res,
    next
) => {

    try {

        console.log("CATEGORY LIST: Loading categories...");

        const categories =
            await getAllCategories();


        console.log(
            "CATEGORY LIST: Categories loaded:",
            categories
        );


        return res.render(
            "categories",
            {
                title: "Categories",
                categories: categories || []
            }
        );


    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "CATEGORY LIST ERROR"
        );

        console.error(
            "================================="
        );

        console.error(error);

        return next(error);

    }

};



/* =========================================
   CATEGORY DETAILS
========================================= */

const buildCategoryDetail = async (
    req,
    res,
    next
) => {

    try {

        const categoryId =
            req.params.id;


        console.log(
            "CATEGORY DETAIL ID:",
            categoryId
        );


        /*
         * Make sure the ID is numeric.
         */
        if (!/^\d+$/.test(categoryId)) {

            return res.status(404).render(
                "404",
                {
                    title: "Category Not Found"
                }
            );

        }


        const category =
            await getCategoryById(
                Number(categoryId)
            );


        if (!category) {

            return res.status(404).render(
                "404",
                {
                    title: "Category Not Found"
                }
            );

        }


        const projects =
            await getProjectsByCategory(
                Number(categoryId)
            );


        return res.render(
            "category-details",
            {
                title: category.name,
                category,
                projects: projects || []
            }
        );


    } catch (error) {

        console.error(
            "CATEGORY DETAIL ERROR:"
        );

        console.error(error);

        return next(error);

    }

};



/* =========================================
   NEW CATEGORY FORM
========================================= */

const buildNewCategory = (
    req,
    res
) => {

    return res.render(
        "new-category",
        {
            title: "Create Category",
            errors: [],
            categoryName: ""
        }
    );

};



/* =========================================
   CREATE CATEGORY
========================================= */

const addCategory = async (
    req,
    res,
    next
) => {

    try {

        const categoryName =
            req.body.categoryName
                ?.trim();


        const errors = [];


        if (
            !categoryName ||
            categoryName.length < 3 ||
            categoryName.length > 100
        ) {

            errors.push({
                msg:
                    "Category name must be between 3 and 100 characters."
            });

        }


        if (errors.length > 0) {

            return res.render(
                "new-category",
                {
                    title: "Create Category",
                    errors,
                    categoryName:
                        categoryName || ""
                }
            );

        }


        await createCategory(
            categoryName
        );


        if (req.flash) {

            req.flash(
                "success",
                "Category created successfully."
            );

        }


        return res.redirect(
            "/categories"
        );


    } catch (error) {

        console.error(
            "CREATE CATEGORY ERROR:"
        );

        console.error(error);


        if (
            error.code === "23505"
        ) {

            return res.render(
                "new-category",
                {
                    title: "Create Category",

                    errors: [
                        {
                            msg:
                                "A category with that name already exists."
                        }
                    ],

                    categoryName:
                        req.body.categoryName || ""
                }
            );

        }


        return next(error);

    }

};



/* =========================================
   EDIT CATEGORY FORM
========================================= */

const buildEditCategory = async (
    req,
    res,
    next
) => {

    try {

        const categoryId =
            req.params.id;


        if (!/^\d+$/.test(categoryId)) {

            return res.status(404).render(
                "404",
                {
                    title: "Category Not Found"
                }
            );

        }


        const category =
            await getCategoryById(
                Number(categoryId)
            );


        if (!category) {

            return res.status(404).render(
                "404",
                {
                    title: "Category Not Found"
                }
            );

        }


        return res.render(
            "edit-category",
            {
                title: "Edit Category",
                errors: [],
                category
            }
        );


    } catch (error) {

        console.error(
            "BUILD EDIT CATEGORY ERROR:"
        );

        console.error(error);

        return next(error);

    }

};



/* =========================================
   UPDATE CATEGORY
========================================= */

const editCategory = async (
    req,
    res,
    next
) => {

    try {

        const categoryName =
            req.body.categoryName
                ?.trim();


        const errors = [];


        if (
            !categoryName ||
            categoryName.length < 3 ||
            categoryName.length > 100
        ) {

            errors.push({
                msg:
                    "Category name must be between 3 and 100 characters."
            });

        }


        if (errors.length > 0) {

            return res.render(
                "edit-category",
                {
                    title: "Edit Category",
                    errors,

                    category: {
                        category_id:
                            req.params.id,

                        name:
                            categoryName || ""
                    }
                }
            );

        }


        await updateCategory(
            Number(req.params.id),
            categoryName
        );


        if (req.flash) {

            req.flash(
                "success",
                "Category updated successfully."
            );

        }


        return res.redirect(
            "/categories"
        );


    } catch (error) {

        console.error(
            "UPDATE CATEGORY ERROR:"
        );

        console.error(error);


        if (
            error.code === "23505"
        ) {

            return res.render(
                "edit-category",
                {
                    title: "Edit Category",

                    errors: [
                        {
                            msg:
                                "A category with that name already exists."
                        }
                    ],

                    category: {
                        category_id:
                            req.params.id,

                        name:
                            req.body.categoryName || ""
                    }
                }
            );

        }


        return next(error);

    }

};



/* =========================================
   EXPORTS
========================================= */

export {

    buildCategoryList,

    buildCategoryDetail,

    buildNewCategory,

    addCategory,

    buildEditCategory,

    editCategory

};