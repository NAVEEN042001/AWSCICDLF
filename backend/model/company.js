const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const autopopulate = require('mongoose-autopopulate');

const companySchema = new Schema({
	name: { 
		type: String, 
		required: [true, 'Please add name'],
		index: {
			unique: true,
			collation: { locale: 'en', strength: 2 },
		} 
	},
	gstin: { type: String },
	email: { 
		type: String, 
		required: [true, 'Please add email'],
		index: {
			unique: true,
			collation: { locale: 'en', strength: 2 },
		}
	},
	phone: { 
		type: [String], 
		validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'Please add phone number'
    },
		index: {
			unique: true, 
			collation: { locale:'en', strength: 2 }
  		}
	},
	address: { type: String, required: [true, 'Please add address'] },
	pincode:{ type: String },
	logo: { type: String },
	active: {type:Boolean},
}, {
	timestamps: true
});
companySchema.plugin(autopopulate);
  
const companyModel = mongoose.model("company", companySchema, "company");

module.exports = {
	companyModel
}