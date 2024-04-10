const { sizeModel } = require('../../model/master-product');
const { purchaseModel } = require('../../model/purchase');

exports.addsize = (req, res, next) => {
    req.body.active = true;
    const size = new sizeModel(req.body);
    size.save()
    .then(savedSize => {
        res.send(savedSize);
    })
    .catch(err => {
        next(err);
    });
};

exports.readsize = (req, res, next) => {
    let _query = {};
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
    }
    sizeModel.find(_query, '-createdBy -updatedBy -__v -createdAt -updatedAt')
        .then(res_size => {
            res.send(res_size);
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
};

exports.updatesize = async (req, res, next) => {
    try {
        const r_size = await sizeModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { runValidators: true, context: 'query', new: true }
        );
        if (r_size) {
            res.send(r_size);
        } else {
            res.status(404).send('Purchase not found');
        }
    } catch (err) {
        next(err);
    }
};

exports.deletesize = async (req, res, next) => {
    try {
        const exist_size_purchase = await purchaseModel.find({"purchased_item.size": req.params.id});
        if (exist_size_purchase.length > 0) {
            return res.send({ exist_size_purchase: exist_size_purchase });
        }
        const updatedSize = await sizeModel.findByIdAndDelete(
            req.params.id,
            { new: true }
        );
        if (updatedSize) {
            return res.send(updatedSize);
        } else {
            return res.status(404).send('Size not found');
        }
    } catch (err) {
        next(err);
    }
};