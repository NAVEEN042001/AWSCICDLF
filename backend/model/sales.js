const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const autopopulate = require('mongoose-autopopulate');


const itemSchema = new Schema({
  item: {
    type: ObjectId,
    required: [true, 'Please add item'],
    ref: 'master_product_item',
    autopopulate: { select: ' -active -createdBy -updatedBy -createdAt -updatedAt -__v' }
  },
  size: {
    type: ObjectId,
    required: [true, 'Please add size'],
    ref: 'master_product_size',
    autopopulate: { select: ' -active -createdBy -updatedBy -createdAt -updatedAt -__v' }
  },
  color: {
    type: ObjectId,
    required: [true, 'Please add size'],
    ref: 'master_product_color',
    autopopulate: { select: ' -active -createdBy -updatedBy -createdAt -updatedAt -__v' }
  },
  price: String,
  quantity:String,
  amount:String
 }, {
  _id: false,
  versionKey: false,
  timestamps: true
})

const saleSchema = new Schema({
  code:String,
  bill_date:Date,
  sale_items: [itemSchema],
  total_amount: String,
  total_quantity:String,
  customer_phone:String,
  discount:String,
  bill_amount:String,
	active: {type:Boolean},
}, {
	timestamps: true
});
saleSchema.plugin(autopopulate);
  
const saleModel = mongoose.model("sale", saleSchema, "sale");

module.exports = {
	saleModel
}