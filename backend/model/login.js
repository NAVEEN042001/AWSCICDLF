const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const autopopulate = require('mongoose-autopopulate');

/* Here unique is for mongoose internal implementaion to maintain unique email field. 
 * This does not enforce unique validation. Unique validation is handled by mongoose-unique-validator
*/
const loginSchema = new Schema({
  refName: { type: String, required: [true, 'Please add ref name'] },
  refID: { type: ObjectId, refPath: 'refName', autopopulate: true },
  email: { 
    type: String, 
    required: true, 
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 },
    }
  }, 
  password: { type: String, required: true },
  active: Boolean,
  createdBy: ObjectId,
  updatedBy: ObjectId
});
loginSchema.plugin(autopopulate);

const loginModel = mongoose.model("login", loginSchema, "login");

module.exports = {
  loginModel
};