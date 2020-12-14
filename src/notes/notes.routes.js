const express = require('express');
const Note = require('./notes.controllers');

// Require the Middleware
const validateToken = require('../users.auth.middleware').validateToken;
const authorize = require("../authorizeUsers").authorize;
// Specify the Routes
module.exports = function (router) {
    router 
        .route("/notes")
        .post(validateToken,authorize('User'),Note.createNote)
        .get(validateToken,authorize('User'),Note.getAll);


    router  
        .route("/notes/noteID/:noteID")
        .get(validateToken,authorize('User'),Note.getOne)
        .put(validateToken,authorize('User'),Note.update)
        .patch(validateToken,authorize('User'),(Note.update))
        .delete(validateToken,authorize('User'),Note.delete)

}