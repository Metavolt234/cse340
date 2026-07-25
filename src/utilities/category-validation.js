import { body, validationResult } from "express-validator";

/**
 * Rules for creating/updating a category
 */
const categoryRules = () => {
    return [
        body("categoryName")
            .trim()
            .notEmpty()
            .withMessage("Category name is required.")
            .isLength({ min: 3 })
            .withMessage("Category name must be at least 3 characters.")
            .isLength({ max: 100 })
            .withMessage("Category name cannot exceed 100 characters.")
    ];
};

/**
 * Check validation results
 */
const checkCategoryData = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const category = {
            category_id: req.params.id,
            name: req.body.categoryName
        };

        const view = req.originalUrl.includes("edit-category")
            ? "edit-category"
            : "new-category";

        return res.status(400).render(view, {
            title: view === "edit-category" ? "Edit Category" : "Create Category",
            errors: errors.array(),
            category,
            categoryName: req.body.categoryName
        });
    }

    next();
};

export { categoryRules, checkCategoryData };