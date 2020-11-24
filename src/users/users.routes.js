const express = require('express');
const Users = require("./users.controller");



module.exports = function (router) {
    router
        .route("/users")
        .post(Users.create)
        .get(Users.getAll);

    router  
        .route("/users/login")
        .post(Users.login);

    router 
        .route("/users/getdetails/userid/:userid")
        .get(Users.getUserDetails);

    router
		.route('/users/userID/:userID')
		// Update  Users By Id
		.patch(Users.update)
        .put(Users.update);
        
    router
        .route("/users/userid/:userid")
        .delete(Users.delete)

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