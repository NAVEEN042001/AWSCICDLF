const { barcodeModel } = require('../model/barcode');

exports.addbarcode = (req, res, next) => {
    req.body.active = true;
    const brand = new barcodeModel(req.body);
    brand.save()
    .then(savedBarcode => {
        res.send(savedBarcode);
    })
    .catch(err => {
        next(err);
    });
};

exports.readbarcode = (req, res, next) => {
    console.log("inside readbarcode",req.query)
    let _query = {};
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
    }
    barcodeModel.findOne(_query, '-createdBy -updatedBy -__v -createdAt -updatedAt')
        .then(res_barcode => {
            res.send(res_barcode);
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
};