import db from "./db.js";
import bcrypt from "bcrypt";



/**
 * Create User
 */
const createUser = async (
    name,
    email,
    passwordHash
) => {


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


    const result = await db.query(
        sql,
        [
            name,
            email,
            passwordHash
        ]
    );


    return result.rows[0];

};








/**
 * Find user by email
 */
const findUserByEmail = async(email)=>{


    const sql = `

        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name

        FROM users u

        JOIN roles r
        ON u.role_id = r.role_id

        WHERE email=$1;

    `;



    const result =
        await db.query(
            sql,
            [email]
        );



    if(result.rows.length === 0){

        return null;

    }


    return result.rows[0];

};








/**
 * Verify Password
 */
const verifyPassword = async(
    password,
    passwordHash
)=>{


    return bcrypt.compare(
        password,
        passwordHash
    );


};









/**
 * Authenticate User
 */
const authenticateUser = async(
    email,
    password
)=>{


    const user =
        await findUserByEmail(email);



    if(!user){

        return null;

    }




    const valid =
        await verifyPassword(
            password,
            user.password_hash
        );



    if(!valid){

        return null;

    }



    delete user.password_hash;



    return user;


};









/**
 * Get All Users
 */
const getAllUsers = async()=>{


    const sql = `

        SELECT

            u.name,

            u.email,

            r.role_name


        FROM users u


        JOIN roles r

        ON u.role_id = r.role_id


        ORDER BY u.name;


    `;



    const result =
        await db.query(sql);



    return result.rows;


};








export {

    createUser,

    authenticateUser,

    getAllUsers

};