import bcrypt from "bcrypt";


import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";


import {
    setFlash
} from "../utilities/flash.js";



/* =====================================
   REGISTER
===================================== */

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



const processUserRegistrationForm =
    async (req, res) => {

        const {
            name,
            email,
            password
        } = req.body;


        const errors = [];


        if (
            !name ||
            name.trim().length < 2
        ) {

            errors.push({
                msg:
                    "Name must be at least 2 characters."
            });

        }


        if (
            !email ||
            !email.includes("@")
        ) {

            errors.push({
                msg:
                    "Please enter a valid email address."
            });

        }


        if (
            !password ||
            password.length < 6
        ) {

            errors.push({
                msg:
                    "Password must be at least 6 characters."
            });

        }


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

            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );


            await createUser(
                name.trim(),
                email.trim().toLowerCase(),
                passwordHash
            );


            setFlash(
                req,
                "success",
                "Your account was created successfully. You can now log in."
            );


            return res.redirect(
                "/login"
            );


        } catch (error) {

            console.error(error);


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


            return res.status(500).render(
                "500",
                {
                    title: "500 - Server Error"
                }
            );

        }

    };



/* =====================================
   LOGIN
===================================== */

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



const processLoginForm =
    async (req, res) => {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

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

            const user =
                await authenticateUser(
                    email
                        .trim()
                        .toLowerCase(),
                    password
                );


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


            setFlash(
                req,
                "success",
                `Welcome back, ${user.name}! You are now logged in.`
            );


            return res.redirect(
                "/dashboard"
            );


        } catch (error) {

            console.error(error);


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



/* =====================================
   LOGOUT
===================================== */

const processLogout = (
    req,
    res
) => {

    req.session.regenerate(
        (error) => {

            if (error) {

                console.error(error);

                return res.redirect(
                    "/login"
                );

            }


            setFlash(
                req,
                "success",
                "You have been logged out successfully."
            );


            res.redirect(
                "/login"
            );

        }
    );

};



/* =====================================
   REQUIRE LOGIN
===================================== */

const requireLogin = (
    req,
    res,
    next
) => {

    if (!req.session.user) {

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



/* =====================================
   REQUIRE ROLE
===================================== */

const requireRole = (
    role
) => {

    return (
        req,
        res,
        next
    ) => {


        if (
            !req.session.user ||
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



/* =====================================
   DASHBOARD
===================================== */

const showDashboard = (
    req,
    res
) => {

    const {
        name,
        email
    } = req.session.user;


    res.render(
        "dashboard",
        {
            title: "Dashboard",
            name,
            email,
            user:
                req.session.user
        }
    );

};



/* =====================================
   ADMIN USERS
===================================== */

const showUsers =
    async (req, res) => {

        const users =
            await getAllUsers();


        res.render(
            "users",
            {
                title:
                    "Registered Users",
                users
            }
        );

    };



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