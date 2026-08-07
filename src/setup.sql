
-- ========================================
-- ORGANIZATION TABLE
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- SERVICE PROJECT TABLE
-- ========================================

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,

    organization_id INT NOT NULL,

    name VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


-- ========================================
-- CATEGORY TABLE
-- ========================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE
);


-- ========================================
-- PROJECT CATEGORY TABLE
-- Many-to-many relationship between
-- service projects and categories
-- ========================================

CREATE TABLE project_category (
    project_id INT NOT NULL,

    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_pc_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);


-- ========================================
-- ROLES TABLE
-- ========================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,

    role_name VARCHAR(50) UNIQUE NOT NULL,

    role_description TEXT
);


-- ========================================
-- INITIAL ROLES
-- ========================================

INSERT INTO roles
(
    role_name,
    role_description
)
VALUES
(
    'user',
    'Standard user with basic access'
),
(
    'admin',
    'Administrator with full system access'
);


-- ========================================
-- USERS TABLE
-- ========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    role_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE SET NULL
);


-- ========================================
-- PROJECT VOLUNTEER TABLE
--
-- Many-to-many relationship between
-- users and service projects.
--
-- One user can volunteer for many projects.
-- One project can have many volunteers.
-- ========================================

CREATE TABLE project_volunteer (
    user_id INT NOT NULL,

    project_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, project_id),

    CONSTRAINT fk_volunteer_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_volunteer_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE
);


-- ========================================
-- INSERT ORGANIZATIONS
-- ========================================

INSERT INTO organization
(
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',

    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',

    'info@brightfuturebuilders.org',

    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',

    'An urban farming collective promoting food sustainability and education in local neighborhoods.',

    'contact@greenharvest.org',

    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',

    'A volunteer coordination group supporting local charities and service initiatives.',

    'hello@unityserve.org',

    'unityserve-logo.png'
);


-- ========================================
-- INSERT SERVICE PROJECTS
-- ========================================

INSERT INTO service_project
(
    organization_id,
    name,
    description
)
VALUES
(
    1,

    'Park Cleanup',

    'Join us to clean up local parks and make them beautiful!'
),
(
    2,

    'Food Drive',

    'Help collect and distribute food to those in need.'
),
(
    3,

    'Community Tutoring',

    'Volunteer to tutor students in various subjects.'
);


-- ========================================
-- INSERT CATEGORIES
-- ========================================

INSERT INTO category
(
    name
)
VALUES
(
    'Community Service'
),
(
    'Environmental Projects'
),
(
    'Education & Tutoring'
),
(
    'Food Assistance'
),
(
    'Health & Wellness'
);


-- ========================================
-- ASSOCIATE PROJECTS WITH CATEGORIES
-- ========================================

INSERT INTO project_category
(
    project_id,
    category_id
)
VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 4),
(3, 1),
(3, 3);


-- ========================================
-- OPTIONAL DATABASE CHECKS
-- ========================================

-- Check organizations
-- SELECT * FROM organization;

-- Check projects
-- SELECT * FROM service_project;

-- Check categories
-- SELECT * FROM category;

-- Check users
-- SELECT * FROM users;

-- Check volunteer table
-- SELECT * FROM project_volunteer;

