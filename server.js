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
   EXPRESS
========================================= */

const app = express();



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

            secure: false,

            maxAge:
                1000 * 60 * 60 * 24

        }

    })
);



/* =========================================
   FLASH
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
             * Flash messages
             */
            res.locals.flash =
                req.flash();


            /*
             * Login status
             */
            res.locals.isLoggedIn =
                Boolean(
                    req.session?.user
                );


            /*
             * Current user
             */
            res.locals.user =
                req.session?.user
                || null;


            /*
             * Environment
             */
            res.locals.NODE_ENV =
                NODE_ENV;


            next();

        } catch (error) {

            console.error(
                "GLOBAL MIDDLEWARE ERROR:"
            );

            console.error(error);

            next(error);
        }

    }
);



/* =========================================
   HOME
========================================= */

app.get(
    "/",
    (req, res, next) => {

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
   ROUTES
========================================= */

app.use(
    "/organizations",
    organizationRoutes
);


app.use(
    "/projects",
    projectRoutes
);


app.use(
    "/categories",
    categoryRoutes
);


app.use(
    "/",
    userRoutes
);



/* =========================================
   404
========================================= */

app.use(
    (req, res) => {

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
            "Method:",
            req.method
        );

        console.error(
            "Message:",
            err.message
        );

        console.error(
            "Stack:"
        );

        console.error(
            err.stack
        );

        console.error(
            "================================="
        );


        /*
         * Prevent another error if
         * headers have already been sent.
         */
        if (res.headersSent) {

            return next(err);

        }


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

        try {

            await testConnection();


            console.log("");
            console.log(
                "================================="
            );

            console.log(
                `Server running at http://127.0.0.1:${PORT}`
            );

            console.log(
                `Environment: ${NODE_ENV}`
            );

            console.log(
                "================================="
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