const { sleeveTypeModel } = require('../../model/master-product');
const { purchaseModel } = require('../../model/purchase');

exports.addSleeveType = (req, res, next) => {
    req.body.active = true;
    const st = new sleeveTypeModel(req.body);
    st.save()
    .then(savedST => {
        res.send(savedST);
    })
    .catch(err => {
        next(err);
    });
};

exports.readSleeveType = (req, res, next) => {
    let _query = {};
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
    }
    sleeveTypeModel.find(_query, '-createdBy -updatedBy -__v -createdAt -updatedAt')
        .then(res_st => {
            res.send(res_st);
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
};

exports.updateSleeveType = async (req, res, next) => {
    try {
        const r_sl = await sleeveTypeModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { runValidators: true, context: 'query', new: true }
        );
        if (r_sl) {
            res.send(r_sl);
        } else {
            res.status(404).send('Purchase not found');
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteSleeveType = async (req, res, next) => {
    try {
        const exist_st_purchase = await purchaseModel.find({"purchased_item.sleeve_type": req.params.id});
        if (exist_st_purchase.length > 0) {
            return res.send({ exist_st_purchase: exist_st_purchase });
        }
        const updatedST = await sleeveTypeModel.findByIdAndDelete(
            req.params.id,
            { new: true }
        );
        if (updatedST) {
            return res.send(updatedST);
        } else {
            return res.status(404).send('Sleeve Type not found');
        }
    } catch (err) {
        next(err);
    }
};

