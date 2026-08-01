

-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Service Project Table
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
-- Category Table
-- ========================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project Category Table
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
-- Insert Organizations
-- ========================================

INSERT INTO organization
(name, description, contact_email, logo_filename)
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
-- Insert Service Projects
-- ========================================

INSERT INTO service_project
(organization_id, name, description)
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
-- Insert Categories
-- ========================================

INSERT INTO category (name)
VALUES
('Community Service'),
('Environmental Projects'),
('Education & Tutoring'),
('Food Assistance'),
('Health & Wellness');

-- ========================================
-- Associate Projects with Categories
-- ========================================

INSERT INTO project_category
(project_id, category_id)
VALUES
(1,1),
(1,2),
(2,1),
(2,4),
(3,1),
(3,3);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- ========================================
-- Insert Initial Roles
-- ========================================

INSERT INTO roles
(role_name, role_description)
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
-- Users Table
-- ========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);