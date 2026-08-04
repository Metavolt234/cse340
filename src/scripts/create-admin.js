import bcrypt from "bcrypt";
import db from "../models/db.js";


const ADMIN_NAME = "Administrator";

const ADMIN_EMAIL =
    "admin@example.com";

const ADMIN_PASSWORD =
    "cse340!";


const main = async () => {

    try {

        const passwordHash =
            await bcrypt.hash(
                ADMIN_PASSWORD,
                10
            );


        const query = `

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
                    WHERE role_name = 'admin'
                )

            )

            ON CONFLICT (email)

            DO UPDATE SET

                name = EXCLUDED.name,

                password_hash =
                    EXCLUDED.password_hash,

                role_id =
                (
                    SELECT role_id
                    FROM roles
                    WHERE role_name = 'admin'
                )

            RETURNING
                user_id,
                name,
                email,
                role_id;

        `;


        const result =
            await db.query(
                query,
                [
                    ADMIN_NAME,
                    ADMIN_EMAIL,
                    passwordHash
                ]
            );


        console.log(
            "Admin testing account is ready:"
        );


        console.log(
            result.rows[0]
        );


        console.log(
            "Password: cse340!"
        );


    } catch (error) {

        console.error(
            "Could not create admin account:",
            error
        );

        process.exitCode = 1;

    } finally {

        await db.end();

    }

};


main();