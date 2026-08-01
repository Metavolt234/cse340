import bcrypt from "bcrypt";


import {

    createUser,

    authenticateUser,

    getAllUsers


} from "../models/users.js";






/**
 * Register Page
 */
const showUserRegistrationForm=(req,res)=>{


    res.render(
        "register",
        {
            title:"Register",
            errors:[],
            user:{}
        }
    );


};







/**
 * Register User
 */
const processUserRegistrationForm=async(req,res)=>{


    const {

        name,

        email,

        password

    } = req.body;



    const errors=[];



    if(!name){

        errors.push({
            msg:"Name is required"
        });

    }



    if(!email){

        errors.push({
            msg:"Email is required"
        });

    }



    if(!password){

        errors.push({
            msg:"Password is required"
        });

    }





    if(errors.length>0){


        return res.render(
            "register",
            {
                title:"Register",
                errors,
                user:{
                    name,
                    email
                }
            }
        );

    }





    try{


        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );



        await createUser(
            name,
            email,
            passwordHash
        );



        res.redirect("/login");



    }catch(error){


        console.log(error);



        res.status(500).render(
            "500",
            {
                title:"Server Error"
            }
        );

    }


};









/**
 * Login Page
 */
const showLoginForm=(req,res)=>{


    res.render(
        "login",
        {
            title:"Login",
            errors:[]
        }
    );


};








/**
 * Login Process
 */
const processLoginForm=async(req,res)=>{


    const {

        email,

        password

    } = req.body;



    const user =
        await authenticateUser(
            email,
            password
        );



    if(user){


        req.session.user=user;



        console.log(
            "Logged in:",
            user
        );



        return res.redirect(
            "/dashboard"
        );


    }




    res.render(
        "login",
        {
            title:"Login",
            errors:[
                {
                    msg:"Invalid email or password"
                }
            ]
        }
    );


};









/**
 * Logout
 */
const processLogout=(req,res)=>{


    req.session.destroy(()=>{


        res.redirect("/login");


    });


};









/**
 * Require Login
 */
const requireLogin=(req,res,next)=>{


    if(!req.session.user){


        return res.redirect(
            "/login"
        );


    }



    next();


};









/**
 * Require Role
 */
const requireRole=(role)=>{


    return(req,res,next)=>{


        if(

            !req.session.user ||

            req.session.user.role_name !== role

        ){


            return res.redirect(
                "/dashboard"
            );


        }



        next();


    };


};









/**
 * Dashboard
 */
const showDashboard=(req,res)=>{


    const {

        name,

        email

    } = req.session.user;



    res.render(
        "dashboard",
        {

            title:"Dashboard",

            name,

            email,

            user:req.session.user

        }
    );


};









/**
 * Users Admin Page
 */
const showUsers=async(req,res)=>{


    const users =
        await getAllUsers();



    res.render(
        "users",
        {
            title:"Users",
            users
        }
    );


};








export {

    showUserRegistrationForm,

    processUserRegistrationForm,

    showLoginForm,

    processLoginForm,

    processLogout,

    requireLogin,

    requireRole,

    showDashboard,

    showUsers

};