const Note = require("./notes.model");
const User = require('../users/users.model');

//Create Notes
exports.creatNote = async (req,res,next) =>{
    try {
        let body = req.body;
        const userData = await User.findById(payload.userID);


    } catch (error) {
        
    }
}