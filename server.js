
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';

import categoryRoutes from "./src/routes/categoryRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import organizationRoutes from "./src/routes/organizationRoutes.js";

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Create __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the Express application
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// Home Page
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

// Organizations Page
app.use("/organizations", organizationRoutes);

// Projects Page
app.use("/projects", projectRoutes);

//Categories page

app.use("/categories", categoryRoutes);

//Errors
//404
app.use((req, res) => {
    res.status(404).render("404", {
        title: "404 - Page Not Found"
    });
});

//500
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).render("500", {
        title: "500 - Server Error"
    });
});

/**
 * Start the server
 */
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});