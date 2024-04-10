const { colorModel } = require('../../model/master-product');
const { codeLengthPad } = require('../../service/generic');
const { purchaseModel } = require('../../model/purchase');


function ColorCode() {
    return colorModel.find()
    .sort({ $natural: -1 })
    .limit(1)
    .then(r_code => {
        let seqNum = '001';
        if (r_code.length) {
            let _cCode = r_code[0].shortcode.split('-');
            seqNum = codeLengthPad(parseInt(_cCode[_cCode.length - 1]) + 1, 3);
        }
        return { shortcode: 'CL-' + seqNum };
    })
    .catch(err => {
        throw err; // Forward the error to the caller
    });
}

exports.readcode = (req, res, next) => {
    ColorCode()
    .then(p_code => {
        res.send(p_code);
    })
    .catch(err => {
        console.error(err);
        next(err);
    });
};

exports.addcolor = async (req, res, next) => {
    const shortcode = await ColorCode()
    req.body.active = true;
    req.body.shortcode = shortcode.shortcode
    const color = new colorModel(req.body);
    color.save()
        .then(savedColor => {
            res.send(savedColor);
        })
        .catch(err => {
            next(err);
        });
};

exports.readcolor = (req, res, next) => {
    let _query = {};
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
    }
    colorModel.find(_query, '-createdBy -updatedBy -__v -createdAt -updatedAt')
    .then(res_color => {
        res.send(res_color);
    })
    .catch(err => {
        console.error(err);
        next(err);
    });
};

exports.updatecolor = async (req, res, next) => {
    try {
        const r_color = await colorModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { runValidators: true, context: 'query', new: true }
        );
        if (r_color) {
            res.send(r_color);
        } else {
            res.status(404).send('Purchase not found');
        }
    } catch (err) {
        next(err);
    }
};

exports.deletecolor = async (req, res, next) => {
    try {
        const exist_color_purchase = await purchaseModel.find({"purchased_item.color": req.params.id});
        if (exist_color_purchase.length > 0) {
            return res.send({ exist_color_purchase: exist_color_purchase });
        }
        const updatedColor = await colorModel.findByIdAndDelete(
            req.params.id,
            { new: true }
        );
        if (updatedColor) {
            return res.send(updatedColor);
        } else {
            return res.status(404).send('Colour not found');
        }
    } catch (err) {
        next(err);
    }
};
