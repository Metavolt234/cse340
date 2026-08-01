import express from 'express';
import session from "express-session";
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';

import categoryRoutes from "./src/routes/categoryRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import organizationRoutes from "./src/routes/organizationRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";


// Define environment

const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase() || 'production';


// Define port

const PORT =
    process.env.PORT || 3000;



// Create __filename and __dirname

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



// Create Express application

const app = express();





// ===============================
// Middleware
// ===============================


// Parse form data

app.use(
    express.urlencoded({
        extended: true
    })
);



// Parse JSON

app.use(
    express.json()
);




// Session configuration

app.use(
    session({

        secret:
            process.env.SESSION_SECRET ||
            "cse340-secret-key",

        resave: false,

        saveUninitialized: false,


        cookie: {

            maxAge:
                1000 * 60 * 60 * 24

        }

    })
);




// Make login information available to views

app.use(
    (req, res, next) => {


        res.locals.isLoggedIn = false;


        if(
            req.session &&
            req.session.user
        ){

            res.locals.isLoggedIn = true;

        }



        res.locals.user =
            req.session.user || null;



        next();

    }
);




// Serve static files

app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);





// ===============================
// EJS Configuration
// ===============================


app.set(
    'view engine',
    'ejs'
);



app.set(
    'views',
    path.join(__dirname, 'src/views')
);







// ===============================
// Routes
// ===============================



// Home Page

app.get(
    '/',
    async (req, res) => {


        const title = "Home";


        res.render(
            "home",
            {
                title
            }
        );


    }
);





// Organization Routes

app.use(
    "/organizations",
    organizationRoutes
);





// Project Routes

app.use(
    "/projects",
    projectRoutes
);





// Category Routes

app.use(
    "/categories",
    categoryRoutes
);





// User Routes

app.use(
    "/",
    userRoutes
);







// ===============================
// Error Handling
// ===============================


// 404

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





// 500

app.use(
    (err, req, res, next) => {


        console.error(
            err.stack
        );


        res.status(500).render(
            "500",
            {
                title:
                "500 - Server Error"
            }
        );


    }
);







// ===============================
// Start Server
// ===============================


app.listen(
    PORT,

    async () => {


        try {


            await testConnection();



            console.log(
                `Server is running at http://127.0.0.1:${PORT}`
            );


            console.log(
                `Environment: ${NODE_ENV}`
            );



        } catch(error) {


            console.error(
                "Error connecting to database:",
                error
            );


        }


    }
);