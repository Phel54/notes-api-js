const express = require('express');
const validateToken = require('../users.auth.middleware').validateToken;
const Users = require("./users.controller");
// import authorize from "../authorizeUsers"
const authorize = require("../authorizeUsers").authorize;


module.exports = function (router) {
    router
        .route("/users")
        .post(Users.create)
        .get(validateToken,authorize('User'),Users.getAll);

    router  
        .route("/users/login")
        .post(Users.login);

    router 
        .route("/users/getdetails/userid/:userid")
        .get(validateToken,authorize('User','Admin'),Users.getUserDetails);

    router
		.route('/users/userID/:userID')
		// Update  Users By Id
		.patch(validateToken,authorize('User'), Users.update)
        .put(validateToken,authorize('User'), Users.update);
        
    router
        .route("/users/userid/:userid")
        .delete(validateToken,authorize('User'),Users.delete)

    router
        .route('/users/recoverPassword')
        .post(Users.recoverPassword);

    router
        .route('/users/resetPassword/:token')
        .post(Users.resetPassword); 
    
        router
        .route('/users/displaycount')
        .get(Users.getUsersCount); 

}