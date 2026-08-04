import express from "express";
import session from "express-session";
import connectFlash from "connect-flash";

import {
    fileURLToPath
} from "url";

import path from "path";

import {
    testConnection
} from "./src/models/db.js";


import categoryRoutes
    from "./src/routes/categoryRoutes.js";

import projectRoutes
    from "./src/routes/projectRoutes.js";

import organizationRoutes
    from "./src/routes/organizationRoutes.js";

import userRoutes
    from "./src/routes/userRoutes.js";



/* =========================================
   ENVIRONMENT
========================================= */

const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase()
    || "production";


const PORT =
    process.env.PORT || 3000;



/* =========================================
   ES MODULE PATHS
========================================= */

const __filename =
    fileURLToPath(import.meta.url);


const __dirname =
    path.dirname(__filename);



/* =========================================
   EXPRESS APPLICATION
========================================= */

const app = express();



/*
 * Render runs behind a proxy.
 *
 * This allows Express to correctly
 * understand HTTPS requests coming
 * through Render.
 */

if (NODE_ENV === "production") {

    app.set(
        "trust proxy",
        1
    );

}



/* =========================================
   EJS
========================================= */

app.set(
    "view engine",
    "ejs"
);


app.set(
    "views",
    path.join(
        __dirname,
        "src/views"
    )
);



/* =========================================
   BODY PARSING
========================================= */

app.use(
    express.urlencoded({
        extended: true
    })
);


app.use(
    express.json()
);



/* =========================================
   STATIC FILES
========================================= */

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);



/* =========================================
   SESSION
========================================= */

app.use(
    session({

        secret:
            process.env.SESSION_SECRET
            || "cse340-secret-key",

        resave: false,

        saveUninitialized: false,

        cookie: {

            /*
             * Render uses HTTPS in production.
             */

            secure:
                NODE_ENV === "production",

            httpOnly: true,

            maxAge:
                1000 * 60 * 60 * 24

        }

    })
);



/* =========================================
   FLASH MESSAGES
========================================= */

app.use(
    connectFlash()
);



/* =========================================
   GLOBAL VIEW VARIABLES
========================================= */

app.use(
    (req, res, next) => {

        try {

            /*
             * ---------------------------------
             * FLASH MESSAGES
             * ---------------------------------
             *
             * Make flash available to every
             * EJS view.
             */

            res.locals.flash =
                req.flash();



            /*
             * ---------------------------------
             * LOGIN STATUS
             * ---------------------------------
             */

            res.locals.isLoggedIn =
                Boolean(
                    req.session &&
                    req.session.user
                );



            /*
             * ---------------------------------
             * CURRENT USER
             * ---------------------------------
             */

            res.locals.user =
                req.session?.user
                || null;



            /*
             * ---------------------------------
             * ADMIN STATUS
             * ---------------------------------
             *
             * This is important because
             * several views use:
             *
             * <% if (isAdmin) { %>
             */

            res.locals.isAdmin =
                Boolean(
                    req.session?.user &&
                    (
                        req.session.user.role_name === "admin" ||
                        req.session.user.role === "admin"
                    )
                );



            /*
             * ---------------------------------
             * USER ROLE
             * ---------------------------------
             */

            res.locals.userRole =
                req.session?.user?.role_name
                || req.session?.user?.role
                || null;



            /*
             * ---------------------------------
             * ENVIRONMENT
             * ---------------------------------
             */

            res.locals.NODE_ENV =
                NODE_ENV;



            next();

        } catch (error) {

            console.error(
                "GLOBAL MIDDLEWARE ERROR:"
            );

            console.error(
                error
            );

            next(error);

        }

    }
);



/* =========================================
   HOME PAGE
========================================= */

app.get(
    "/",
    async (req, res, next) => {

        try {

            res.render(
                "home",
                {
                    title: "Home"
                }
            );

        } catch (error) {

            next(error);

        }

    }
);



/* =========================================
   ORGANIZATIONS
========================================= */

app.use(
    "/organizations",
    organizationRoutes
);



/* =========================================
   PROJECTS
========================================= */

app.use(
    "/projects",
    projectRoutes
);



/* =========================================
   CATEGORIES
========================================= */

app.use(
    "/categories",
    categoryRoutes
);



/* =========================================
   USERS / AUTHENTICATION
========================================= */

app.use(
    "/",
    userRoutes
);



/* =========================================
   404 ERROR
========================================= */

app.use(
    (req, res) => {

        console.error(
            "404 - Page not found:",
            req.method,
            req.originalUrl
        );


        res.status(404).render(
            "404",
            {
                title:
                    "404 - Page Not Found"
            }
        );

    }
);



/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

app.use(
    (err, req, res, next) => {

        console.error("");
        console.error(
            "================================="
        );

        console.error(
            "SERVER ERROR"
        );

        console.error(
            "================================="
        );

        console.error(
            "URL:",
            req.originalUrl
        );

        console.error(
            "METHOD:",
            req.method
        );

        console.error(
            "MESSAGE:",
            err.message
        );

        console.error(
            "STACK:"
        );

        console.error(
            err.stack
        );

        console.error(
            "================================="
        );



        /*
         * If Express already sent a response,
         * pass the error to the default handler.
         */

        if (res.headersSent) {

            return next(err);

        }



        /*
         * Render the 500 page.
         */

        res.status(500).render(
            "500",
            {
                title:
                    "500 - Server Error"
            }
        );

    }
);



/* =========================================
   START SERVER
========================================= */

app.listen(
    PORT,
    async () => {

        console.log("");
        console.log(
            "================================="
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `Environment: ${NODE_ENV}`
        );

        console.log(
            "================================="
        );


        try {

            await testConnection();

            console.log(
                "Database connection successful."
            );

        } catch (error) {

            console.error(
                "DATABASE CONNECTION ERROR:"
            );

            console.error(
                error
            );

        }

    }
);