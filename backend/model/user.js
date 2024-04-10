const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const autopopulate = require('mongoose-autopopulate');

const userSchema = new Schema({ 
  code: {
    type: String,
    required: [true, 'Please add code'],
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 }
    }
  },
  name: {
    type: String,
    required: [true, 'Please add name']
  },
  phone: {
    type: [String],
    validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'Please add phone number'
    },
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 },
    }
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 },
      // partialFilterExpression: { email: { $type: "string" } }
    }
  },
  active: { type: Boolean, required: true, default: true },
  createdBy: ObjectId,
  updatedBy: ObjectId
}, {
  timestamps: true
});
userSchema.plugin(autopopulate);

const userModel = mongoose.model("master_user", userSchema, "master_user");

module.exports = {
  userModel,
};