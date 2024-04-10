const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const autopopulate = require("mongoose-autopopulate");

const brandSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please add brand name'],
        index: {
            unique: true,
            collation: { locale: 'en', strength: 2}
        }
    },
    active: { type: Boolean, required: true, default: true},
    createdBy: ObjectId,
    updatedBy: ObjectId,
},{
    timestamps: true
});
brandSchema.plugin(autopopulate);

const colorSchema = new Schema({
    shortcode: {
        type: String,
        required: [ true, 'Please add short code'],
        index: {
            unique: true,
            collation: { locale: 'en', strength: 2}
        }
    },
    name: {
        type: String,
        required: [true, 'Please add brand name'],
        index: {
            unique: true,
            collation: { locale: 'en', strength: 2}
        }
    },
    active: { type: Boolean, required: true, default: true},
    createdBy: ObjectId,
    updatedBy: ObjectId,
},{
    timestamps: true
});
colorSchema.plugin(autopopulate);

const sizeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please add brand name'],
        index: {
            unique: true,
            collation: { locale: 'en', strength: 2}
        }
    },
    active: { type: Boolean, required: true, default: true},
    createdBy: ObjectId,
    updatedBy: ObjectId,
},{
    timestamps: true
});
sizeSchema.plugin(autopopulate);

const sleeveTypeSchema = new Schema({
    type: {
        type: String,
        required: [true, 'Please add brand name'],
        index: {
            unique: true,
            collation: { locale: 'en', strength: 2}
        }
    },
    active: { type: Boolean, required: true, default: true},
    createdBy: ObjectId,
    updatedBy: ObjectId,
},{
    timestamps: true
});
sleeveTypeSchema.plugin(autopopulate);


const itemSchema = new Schema({
    shortcode: {
        type: String,
        required: [ true, 'Please add short code'],
        index: {
            unique: true,
            collation: { locale: 'en', strength: 2}
        }
    },
    name: {
        type: String,
        required: [true, 'Please add brand name'],
    },
    brand: {
        type: ObjectId,
        ref: 'master_product_brand',
        autopopulate: { select: '-active -createdBy -updatedBy -createdAt -updatedAt -__v'}
    },
    cost_rate: { type: Number },
    sell_rate: { type: Number },
    units: {
        type: String, 
        required: [true, 'Please add unit'],
        enum: {
          values: ['Pcs', 'Meters'],
          message: '{VALUE} is not supported'
        }
    },
    active: { type: Boolean, required: true, default: true},
    createdBy: ObjectId,
    updatedBy: ObjectId,
},{
    timestamps: true
});
itemSchema.plugin(autopopulate);
itemSchema.index({name: 1, brand: 1}, {unique: true, collation: { locale: 'en', strength: 2 }})

const brandModel = mongoose.model('master_product_brand', brandSchema, 'master_product_brand');
const sizeModel = mongoose.model('master_product_size', sizeSchema, 'master_product_size');
const colorModel = mongoose.model('master_product_color', colorSchema, 'master_product_color');
const sleeveTypeModel = mongoose.model('master_product_sleeve_type', sleeveTypeSchema, 'master_product_sleeve_type');
const itemModel = mongoose.model('master_product_item', itemSchema, 'master_product_item');

module.exports = {
    brandModel,
    colorModel,
    itemModel,
    sizeModel,
    sleeveTypeModel
}