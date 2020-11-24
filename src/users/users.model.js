const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi')

const userSchema = new Schema(
	{
        name:{
            first:{
                type:String,
                required:true,
                trim:true
            },
            last:{
                type:String,
                required:true,
                trim:true
            }
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },

        phoneNumber: {
            type:String,
            required:true,
        },
        gender: {
			type: String,
			enum: ['Male', 'Female', 'LGBTQ', 'Others'],
		},
        isActive: {
			type: Boolean,
			default: true,
		},
		resetPasswordToken: String,
		resetPasswordExpires: String,
    },
	{ timestamps: true }
);


userSchema.methods.joiValidate = (requestBody) => {
    	// defining the validation schema
	const schema = Joi.object({ 

        name: {
            first: Joi.string()
                .trim()
                .min(3)
                .max(20)
                .messages({ 'string.empty': 'Please enter First Name' }),
            last: Joi.string()
                .trim()
                .min(4)
                .max(60)
                .messages({ 'string.empty': 'Please enter Last Name' })

        },
        email: Joi.string()
                .trim()
                .min(6)
                .email()
                .required()                
                .messages({ 'string.empty': 'Please enter Email' }),
      

		phoneNumber: Joi.string()
                .trim()
                .required()
                .min(10)
                .max(10),

        gender: Joi.string()
                .valid('Male', 'Female', 'LGBTQ', 'Others'),



    }).options({ stripUnknown: true });

	return schema.validate(requestBody);

}





        //exporting my model
const User = mongoose.model('User', userSchema, 'User');

module.exports = User;