const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const autopopulate = require('mongoose-autopopulate');

const barcodeSchema = new Schema({
    serial_num: { 
        type: Number, 
        required: [true, 'Please add Serial Number'], 
        index: {
            unique: true,
            collation: { locale: 'en', strength: 2}
        }
    },
	item: {
        type: ObjectId,
        required: [true, 'Please add item'],
        ref: 'master_product_item',
        autopopulate: { select: '-active -createdBy -updatedBy -createdAt -updatedAt -__v'}
    },
    size: {
        type: ObjectId,
        required: [true, 'Please add size'],
        ref: 'master_product_size',
        autopopulate: { select: '-active -createdBy -updatedBy -createdAt -updatedAt -__v'}
    },
    color: {
        type: ObjectId,
        ref: 'master_product_color',
        autopopulate: { select: '-active -createdBy -updatedBy -createdAt -updatedAt -__v'}
    },
    price: { type: Number, required: [true, 'Please add price'] },
    active: { type: Boolean, required: true, default: true},
    createdBy: ObjectId,
    updatedBy: ObjectId,
}, {
	timestamps: true
});
barcodeSchema.plugin(autopopulate);
  
const barcodeModel = mongoose.model("barcode", barcodeSchema, "barcode");

module.exports = {
	barcodeModel
}