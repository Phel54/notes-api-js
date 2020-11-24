const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi')


const noteSchema = new Schema(
	{
        title: String,
        note:String,
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
           },
        isDeleted:{
            type:Boolean,
            default:false
        }
},
{ timestamps: true }
);

noteSchema.methods.joiValidate = (requestBody) => {
    const schema = Joi.object({ 

        title: Joi.string().max(20).min(1).required(),
        note: Joi.string().max(2000).min(2),
        isDeleted: Joi.boolean().valid(false)

    }).options({ stripUnknown: true });

	return schema.validate(requestBody);


}


const Note = mongoose.model('Notes', noteSchema, 'Notes');

module.exports = Note;