
/**
 * =========================================
 * AUTHENTICATION MIDDLEWARE
 * =========================================
 */


/**
 * Require user to be logged in
 *
 * Protects routes that require authentication.
 */
const requireLogin = (req, res, next) => {

    if (
        req.session &&
        req.session.user
    ) {

        return next();

    }


    req.flash(
        "error",
        "Please log in to access that page."
    );


    return res.redirect(
        "/login"
    );

};


/**
 * =========================================
 * REQUIRE SPECIFIC ROLE
 * =========================================
 *
 * Example:
 *
 * router.get(
 *     "/users",
 *     requireLogin,
 *     requireRole("admin"),
 *     controller.buildUsers
 * );
 *
 */

const requireRole = (requiredRole) => {

    return (req, res, next) => {

        if (
            !req.session ||
            !req.session.user
        ) {

            req.flash(
                "error",
                "Please log in to access that page."
            );

            return res.redirect(
                "/login"
            );

        }


        if (
            req.session.user.role_name !==
            requiredRole
        ) {

            req.flash(
                "error",
                "You do not have permission to access that page."
            );

            return res.redirect(
                "/dashboard"
            );

        }


        return next();

    };

};


/**
 * =========================================
 * EXPORT
 * =========================================
 */

export {
    requireLogin,
    requireRole
};

