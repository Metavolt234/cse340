import express from "express";


import {

    showUserRegistrationForm,

    processUserRegistrationForm,

    showLoginForm,

    processLoginForm,

    processLogout,

    requireLogin,

    requireRole,

    showDashboard,

    showUsers

} from "../controllers/users.js";


const router =
    express.Router();



/* Registration */

router.get(
    "/register",
    showUserRegistrationForm
);


router.post(
    "/register",
    processUserRegistrationForm
);



/* Login */

router.get(
    "/login",
    showLoginForm
);


router.post(
    "/login",
    processLoginForm
);



/* Logout */

router.get(
    "/logout",
    processLogout
);



/* Dashboard */

router.get(
    "/dashboard",
    requireLogin,
    showDashboard
);



/* Admin Users */

router.get(
    "/users",
    requireLogin,
    requireRole("admin"),
    showUsers
);


export default router;