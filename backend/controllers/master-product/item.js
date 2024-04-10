const { itemModel } = require('../../model/master-product');
const { purchaseModel } = require('../../model/purchase');
// const Q = require('q');
const { codeLengthPad } = require('../../service/generic');

function ItemCode() {
    return itemModel.find()
    .sort({ $natural: -1 })
    .limit(1)
    .then(r_code => {
        let seqNum = '001';
        if (r_code.length) {
            let _cCode = r_code[0].shortcode.split('-');
            seqNum = codeLengthPad(parseInt(_cCode[_cCode.length - 1]) + 1, 3);
        }
        return { shortcode: 'ITEM-' + seqNum };
    })
    .catch(err => {
        throw err; // Forward the error to the caller
    });
}

exports.readcode = (req, res, next) => {
    ItemCode()
    .then(p_code => {
        res.send(p_code);
    })
    .catch(err => {
        console.error(err);
        next(err);
    });
};

exports.additem = async (req, res, next) => {
    try {
        const shortcode = await ItemCode()
        req.body.active = true;
        req.body.shortcode = shortcode.shortcode
        const item = new itemModel(req.body);
        item.save()
        .then(saveditem => {
            res.send(saveditem);
        }).catch(err => {
            next(err);
        });
    } catch(err){
        next(err)
    }
};

exports.readitem = (req, res, next) => {
    let _query = {};
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
    }
    itemModel.find(_query, '-createdBy -updatedBy -__v -createdAt -updatedAt')
    .then(res_item => {
        res.send(res_item);
    })
    .catch(err => {
        console.error(err);
        next(err);
    });
};

exports.readItemLabel = async (req, res, next) => {
    try {
        let _query = {};
        if (Object.keys(req.query).length) {
            _query = req.query;
            if (_query.active) _query.active = (_query.active == 'true' ? true : false);
        }
        
        let res_item = await itemModel.aggregate([
            { $match: _query },
            {
                $lookup: {
                    from: "master_product_brand",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brand"
                }
            },
            { $unwind: "$brand" },
            { $project: {
                shortcode: 1,
                "brand.name": 1, // Access the brand name from the populated brand field
                name: 1,
                cost_rate: 1,
                sell_rate: 1,
                units: 1,
                itemLabel: {
                    $concat: [
                        "$brand.name",
                        "-",
                        "$name"
                    ]
                }
            }}
        ]).exec(); // Using exec() to execute the aggregation and return a promise
        res.send(res_item);
    } catch (err) {
        next(err);
    }
}

exports.updateitem = async (req, res, next) => {
    try {
        const r_item = await itemModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { runValidators: true, context: 'query', new: true }
        );
        if (r_item) {
            res.send(r_item);
        } else {
            res.status(404).send('Purchase not found');
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteitem = async (req, res, next) => {
    try {
        const exist_item_purchase = await purchaseModel.find({"purchased_item.item": req.params.id});
        if (exist_item_purchase.length > 0) {
            return res.send({ exist_item_purchase: exist_item_purchase });
        }
        const updatedItem = await itemModel.findByIdAndDelete(
            req.params.id,
            { new: true }
        );
        if (updatedItem) {
            return res.send(updatedItem);
        } else {
            return res.status(404).send('Item not found');
        }
    } catch (err) {
        next(err);
    }
};

