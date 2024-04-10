const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const autopopulate = require("mongoose-autopopulate");

const stockSchema = new Schema({
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
        // required: [true, 'Please add color'],
        ref: 'master_product_color',
        autopopulate: { select: '-active -createdBy -updatedBy -createdAt -updatedAt -__v'}
    },
    quantity: { type: Number, required: [true, 'Please add quantity'] },
    active: { type: Boolean, required: true, default: true},
    createdBy: ObjectId,
    updatedBy: ObjectId,
},{
    timestamps: true
});
stockSchema.plugin(autopopulate);


const stockModel = mongoose.model('stock', stockSchema, 'stock');

module.exports = {
    stockModel
}