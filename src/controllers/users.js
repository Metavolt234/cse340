
import bcrypt from "bcrypt";


import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";


import {
    getProjectsByUser
} from "../models/volunteers.js";


import {
    setFlash
} from "../utilities/flash.js";



/* =========================================
   REGISTER
========================================= */

/**
 * Display registration form
 */
const showUserRegistrationForm = (
    req,
    res
) => {

    res.render(
        "register",
        {
            title: "Create Account",
            errors: [],
            user: {}
        }
    );

};



/**
 * Process registration form
 */
const processUserRegistrationForm =
    async (req, res) => {

        const {
            name,
            email,
            password
        } = req.body;


        const errors = [];


        /* -----------------------------
           Validate name
        ----------------------------- */

        if (
            !name ||
            name.trim().length < 2
        ) {

            errors.push({
                msg:
                    "Name must be at least 2 characters."
            });

        }


        /* -----------------------------
           Validate email
        ----------------------------- */

        if (
            !email ||
            !email.includes("@")
        ) {

            errors.push({
                msg:
                    "Please enter a valid email address."
            });

        }


        /* -----------------------------
           Validate password
        ----------------------------- */

        if (
            !password ||
            password.length < 6
        ) {

            errors.push({
                msg:
                    "Password must be at least 6 characters."
            });

        }


        /* -----------------------------
           Return validation errors
        ----------------------------- */

        if (errors.length > 0) {

            return res.status(400).render(
                "register",
                {
                    title: "Create Account",

                    errors,

                    user: {
                        name,
                        email
                    }
                }
            );

        }



        try {

            /* -----------------------------
               Hash password
            ----------------------------- */

            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );


            /* -----------------------------
               Create user
            ----------------------------- */

            await createUser(
                name.trim(),
                email.trim().toLowerCase(),
                passwordHash
            );


            /* -----------------------------
               Success message
            ----------------------------- */

            setFlash(
                req,
                "success",
                "Your account was created successfully. You can now log in."
            );


            return res.redirect(
                "/login"
            );


        } catch (error) {

            console.error(
                "ERROR - processUserRegistrationForm:",
                error
            );


            /* -----------------------------
               Duplicate email
            ----------------------------- */

            if (
                error.code === "23505"
            ) {

                setFlash(
                    req,
                    "error",
                    "An account with that email already exists."
                );


                return res.redirect(
                    "/register"
                );

            }


            /* -----------------------------
               Other database errors
            ----------------------------- */

            return res.status(500).render(
                "500",
                {
                    title:
                        "500 - Server Error"
                }
            );

        }

    };



/* =========================================
   LOGIN
========================================= */

/**
 * Display login form
 */
const showLoginForm = (
    req,
    res
) => {

    res.render(
        "login",
        {
            title: "Login",
            errors: []
        }
    );

};



/**
 * Process login form
 */
const processLoginForm =
    async (req, res) => {

        const {
            email,
            password
        } = req.body;


        /* -----------------------------
           Validate login fields
        ----------------------------- */

        if (
            !email ||
            !password
        ) {

            setFlash(
                req,
                "error",
                "Please enter your email and password."
            );


            return res.redirect(
                "/login"
            );

        }



        try {

            /* -----------------------------
               Authenticate user
            ----------------------------- */

            const user =
                await authenticateUser(
                    email
                        .trim()
                        .toLowerCase(),
                    password
                );


            /* -----------------------------
               Invalid credentials
            ----------------------------- */

            if (!user) {

                setFlash(
                    req,
                    "error",
                    "Login failed. Please check your email and password."
                );


                return res.redirect(
                    "/login"
                );

            }


            /* -----------------------------
               Save user in session
            ----------------------------- */

            req.session.user =
                user;


            console.log(
                "Logged in:",
                {
                    user_id:
                        user.user_id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role_name
                }
            );


            /* -----------------------------
               Login flash message
            ----------------------------- */

            setFlash(
                req,
                "success",
                `Welcome back, ${user.name}! You are now logged in.`
            );


            return res.redirect(
                "/dashboard"
            );


        } catch (error) {

            console.error(
                "ERROR - processLoginForm:",
                error
            );


            setFlash(
                req,
                "error",
                "Unable to complete login. Please try again."
            );


            return res.redirect(
                "/login"
            );

        }

    };



/* =========================================
   LOGOUT
========================================= */

/**
 * Log the user out
 */
const processLogout = (
    req,
    res
) => {

    /*
     * Store the session flash message
     * before destroying the session.
     */

    req.session.destroy(
        (error) => {

            if (error) {

                console.error(
                    "ERROR - processLogout:",
                    error
                );


                return res.redirect(
                    "/login"
                );

            }


            /*
             * Redirect to login after logout.
             */
            return res.redirect(
                "/login?logout=success"
            );

        }
    );

};



/* =========================================
   REQUIRE LOGIN
========================================= */

/**
 * Protect routes that require
 * an authenticated user.
 */
const requireLogin = (
    req,
    res,
    next
) => {

    if (
        !req.session ||
        !req.session.user
    ) {

        setFlash(
            req,
            "error",
            "Please log in to access that page."
        );


        return res.redirect(
            "/login"
        );

    }


    next();

};



/* =========================================
   REQUIRE ROLE
========================================= */

/**
 * Protect routes based on user role.
 *
 * Usage:
 *
 * requireRole("admin")
 */
const requireRole = (
    role
) => {

    return (
        req,
        res,
        next
    ) => {

        if (
            !req.session ||
            !req.session.user
        ) {

            setFlash(
                req,
                "error",
                "Please log in to access that page."
            );


            return res.redirect(
                "/login"
            );

        }


        if (
            req.session.user.role_name !== role
        ) {

            setFlash(
                req,
                "error",
                "You do not have permission to access that page."
            );


            return res.redirect(
                "/dashboard"
            );

        }


        next();

    };

};



/* =========================================
   DASHBOARD
========================================= */

/**
 * Display user dashboard.
 *
 * Week 6:
 * Retrieve all projects that the
 * logged-in user has volunteered for.
 */
const showDashboard =
    async (req, res) => {

        try {

            /* -----------------------------
               Make sure user is logged in
            ----------------------------- */

            if (
                !req.session ||
                !req.session.user
            ) {

                setFlash(
                    req,
                    "error",
                    "Please log in to access your dashboard."
                );


                return res.redirect(
                    "/login"
                );

            }


            const {
                user_id,
                name,
                email
            } = req.session.user;


            /* -----------------------------
               Get volunteer projects
            ----------------------------- */

            const volunteerProjects =
                await getProjectsByUser(
                    user_id
                );


            /* -----------------------------
               Display dashboard
            ----------------------------- */

            return res.render(
                "dashboard",
                {

                    title:
                        "Dashboard",

                    name,

                    email,

                    user:
                        req.session.user,

                    volunteerProjects

                }
            );


        } catch (error) {

            console.error(
                "ERROR - showDashboard:",
                error
            );


            return res.status(500).render(
                "500",
                {
                    title:
                        "500 - Server Error"
                }
            );

        }

    };



/* =========================================
   ADMIN USERS
========================================= */

/**
 * Display all registered users.
 *
 * This route should be protected with:
 *
 * requireLogin
 * requireRole("admin")
 */
const showUsers =
    async (req, res) => {

        try {

            const users =
                await getAllUsers();


            return res.render(
                "users",
                {

                    title:
                        "Registered Users",

                    users

                }
            );


        } catch (error) {

            console.error(
                "ERROR - showUsers:",
                error
            );


            return res.status(500).render(
                "500",
                {
                    title:
                        "500 - Server Error"
                }
            );

        }

    };



/* =========================================
   EXPORTS
========================================= */

export {

    showUserRegistrationForm,

    processUserRegistrationForm,

    showLoginForm,

    processLoginForm,

    processLogout,

    requireLogin,

    requireRole,

    showDashboard,

    showUsers

};

