const { brandModel, itemModel } = require('../../model/master-product');

exports.addbrand = (req, res, next) => {
    req.body.active = true;
    const brand = new brandModel(req.body);
    brand.save()
    .then(savedBrand => {
        res.send(savedBrand);
    })
    .catch(err => {
        next(err);
    });
};

exports.readbrand = (req, res, next) => {
    let _query = {};
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
    }
    brandModel.find(_query, '-createdBy -updatedBy -__v -createdAt -updatedAt')
        .then(res_brand => {
            res.send(res_brand);
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
};

exports.updatebrand = async (req, res, next) => {
    try {
        const r_brand = await brandModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { runValidators: true, context: 'query', new: true }
        );
        if (r_brand) {
            res.send(r_brand);
        } else {
            res.status(404).send('Purchase not found');
        }
    } catch (err) {
        next(err);
    }
};

exports.deletebrand = async (req, res, next) => {
    try {
        const exist_brand_item = await itemModel.find({brand: req.params.id});
        if (exist_brand_item.length > 0) {
            return res.send({ exist_brand_item: exist_brand_item });
        }
        const updatedBrand = await brandModel.findByIdAndDelete(
            req.params.id,
            { new: true }
        );
        if (updatedBrand) {
            return res.send(updatedBrand);
        } else {
            return res.status(404).send('Brand not found');
        }
    } catch (err) {
        next(err);
    }
};
