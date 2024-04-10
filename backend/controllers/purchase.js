const { purchaseModel } = require('../model/purchase');
const { stockModel } = require('../model/stock');

exports.addpurcase = async (req, res, next) => {
    try {
        const purchase = new purchaseModel(req.body);
        await purchase.save(); // Wait for the purchase to be saved
        
        let itmLst = req.body['purchased_item']; // Get the product list from the request body
        for (let i = 0; i < itmLst.length; i++) {
            await stockModel.findOneAndUpdate(
                { item: itmLst[i]['item'], size: itmLst[i]['size'], color: itmLst[i]['color'] },
                { $inc: { quantity: itmLst[i]['quantity'] }},
                { upsert: true, new: true, runValidators: true, context: 'query' }
            );
        }
        res.send(purchase); // Send response after updating stock items
    } catch (err) {
        next(err); // Forward error to error handler middleware
    }
};

exports.readpurchase = (req, res, next) => {
    let _query = {};
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
        if (_query.from_date || _query.to_date) {
            _query.invoiceDate = {};
            if (_query.from_date) {
                _query.invoiceDate['$gte'] = new Date(_query.from_date);
                delete _query.from_date;
            }
            if (_query.to_date) {
                let tDate = new Date(_query.to_date);
                tDate.setDate(tDate.getDate() + 1);
                _query.invoiceDate['$lt'] = tDate;
                delete _query.to_date;
            }
        }
    }

    purchaseModel.find(_query, '-createdBy -updatedBy -__v -createdAt -updatedAt')
    .then(res_item => {
        res.send(res_item);
    })
    .catch(err => {
        console.error(err);
        next(err);
    });
};

exports.updatepurchase = async (req, res, next) => {
    try {
        const exist_data = await purchaseModel.findOne({ _id: req.params.id });
        const addedItems = req.body.purchased_item.filter(item => !exist_data.purchased_item.some(existingItem => existingItem.item === item.item));
        const removedItems = exist_data.purchased_item.filter(item => !req.body.purchased_item.some(newItem => newItem.item === item.item));
        for (let i = 0; i < addedItems.length; i++) {
            const diff = addedItems[i].quantity;
            await stockModel.findOneAndUpdate(
                { item: addedItems[i].item, size: addedItems[i].size, color: addedItems[i].color },
                { $inc: { quantity: diff } },
                { upsert: true, new: true, runValidators: true, context: 'query' }
            );
        }
        for (let i = 0; i < removedItems.length; i++) {
            const diff = -removedItems[i].quantity;
            await stockModel.findOneAndUpdate(
                { item: removedItems[i].item, size: removedItems[i].size, color: removedItems[i].color },
                { $inc: { quantity: diff } },
                { upsert: true, new: true, runValidators: true, context: 'query' }
            );
        }

        const r_pur = await purchaseModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { runValidators: true, context: 'query', new: true }
        );

        if (r_pur) {
            res.send(r_pur);
        } else {
            res.status(404).send('Purchase not found');
        }
    } catch (err) {
        next(err);
    }
};


exports.deletepurchase = async (req, res, next) => {
    try {
        const exist_data = await purchaseModel.findOne({ _id: req.params.id }); // Corrected to findOne
        let itmLst = exist_data['purchased_item']; // Get the product list from the retrieved data
        for (let i = 0; i < itmLst.length; i++) {
            await stockModel.findOneAndUpdate(
                { item: itmLst[i]['item'], size: itmLst[i]['size'], color: itmLst[i]['color'] },
                { $inc: { quantity: -itmLst[i].quantity }},
                { upsert: true, new: true, runValidators: true, context: 'query' }
            );
        }
        const d_pur = await purchaseModel.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
        if (d_pur) {
            res.send(d_pur);
        } else {
            res.status(404).send('Purchase not found');
        }
    } catch (err) {
        next(err);
    }
};

