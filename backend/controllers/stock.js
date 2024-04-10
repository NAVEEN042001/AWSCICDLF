const { stockModel } = require('../model/stock');

exports.readStock = (req, res, next) => {
    console.log(req.query)
    let _query = {};
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
    }

    stockModel.find(_query, '-createdBy -updatedBy -__v -createdAt -updatedAt')
    .then(res_item => {
        console.log(res_item)
        res.send(res_item);
    })
    .catch(err => {
        console.error(err);
        next(err);
    });
};