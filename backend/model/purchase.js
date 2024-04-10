const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const autopopulate = require("mongoose-autopopulate");

const purchasedItemSchema = new Schema({
    item: {
        type: ObjectId,
        required: [true, 'Please add item'],
        ref: 'master_product_item',
        autopopulate: { select: '-active -createdBy -updatedBy -createdAt -updatedAt -__v'}
    },
    brand: {
        type: ObjectId,
        required: [true, 'Please add brand'],
        ref: 'master_product_brand',
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
    sleeve_type: {
        type: ObjectId,
        // required: [true, 'Please add sleevetype'],
        ref: 'master_product_sleeve_type',
        autopopulate: { select: '-active -createdBy -updatedBy -createdAt -updatedAt -__v'}
    },
    price: { type: Number ,required: [true, 'Please add item price']},
    quantity: { type: Number, required: [true, 'Please add quantity'] },
})
const prchaseSchema = new Schema({
    invoiceNum: { type: String },
    invoiceDate: { type: Date, required: [true, 'Please add Invoice Date'] },
    supplier: { type: String, required: [true, 'Please add Supplier name'] },
    phone: { type: Number },
    net_total: { type: Number, required: [true, 'Please add Net total'] },
    address: { type: String, required: [true, 'Please add Address'] },
    purchased_item: {
        type: [purchasedItemSchema],
        validate: {
            validator: v => Array.isArray(v) && v.length > 0,
            message: 'Please add Purchased Item'
        }
    },
    active: { type: Boolean, required: true, default: true},
    createdBy: ObjectId,
    updatedBy: ObjectId,
},{
    timestamps: true
});
prchaseSchema.plugin(autopopulate);


const purchaseModel = mongoose.model('purchase', prchaseSchema, 'purchase');

module.exports = {
    purchaseModel
}