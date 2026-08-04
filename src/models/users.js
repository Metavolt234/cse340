import bcrypt from "bcrypt";
import db from "./db.js";


/**
 * =========================================
 * CREATE NEW USER
 * =========================================
 */
const createUser = async (name, email, passwordHash) => {

    const sql = `
        INSERT INTO users
        (
            name,
            email,
            password_hash,
            role_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            (
                SELECT role_id
                FROM roles
                WHERE role_name = 'user'
            )
        )
        RETURNING *;
    `;

    const result = await db.query(sql, [
        name,
        email,
        passwordHash
    ]);

    return result.rows[0];
};


/**
 * =========================================
 * FIND USER BY EMAIL
 * =========================================
 */
const findUserByEmail = async (email) => {

    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            u.role_id,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1
    `;

    const queryParams = [email];

    const result = await db.query(
        query,
        queryParams
    );

    if (result.rows.length === 0) {

        return null;

    }

    return result.rows[0];
};


/**
 * =========================================
 * VERIFY PASSWORD
 * =========================================
 */
const verifyPassword = async (
    password,
    passwordHash
) => {

    return bcrypt.compare(
        password,
        passwordHash
    );

};


/**
 * =========================================
 * AUTHENTICATE USER
 * =========================================
 */
const authenticateUser = async (
    email,
    password
) => {

    const user =
        await findUserByEmail(email);


    // User does not exist
    if (!user) {

        return null;

    }


    // Check password
    const passwordMatches =
        await verifyPassword(
            password,
            user.password_hash
        );


    // Password is incorrect
    if (!passwordMatches) {

        return null;

    }


    /*
    Remove password hash before
    storing user in session.
    */

    delete user.password_hash;


    return user;

};


/**
 * =========================================
 * GET ALL USERS
 * =========================================
 *
 * Used by the admin Users page.
 */
const getAllUsers = async () => {

    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        ORDER BY u.name ASC
    `;

    const result = await db.query(query);

    return result.rows;

};


/**
 * =========================================
 * EXPORTS
 * =========================================
 */

export {
    createUser,
    authenticateUser,
    getAllUsers
};