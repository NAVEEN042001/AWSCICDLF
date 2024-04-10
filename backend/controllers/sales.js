const { saleModel } =require("../model/sales");
const { stockModel } =require("../model/stock");
const Q = require('q');

function saleCode() {
  var deferred = Q.defer();
  saleModel.find()
    .sort({ $natural: -1 })
    .limit(1)
    .exec()
    .then(r_sale => {
      if (r_sale && r_sale.length > 0) {
        let seqNum = '001';
        let lastCode = r_sale[0].code;
        let lastSeq = parseInt(lastCode.split('-').pop());
        seqNum = codeLengthPad(lastSeq + 1, 3);
        deferred.resolve({ code: 'B-' + seqNum });
      } else {
        deferred.resolve({ code: 'B-001' });
      }
    })
    .catch(err => {
      deferred.reject(err);
    });

  return deferred.promise;
}

exports.readSaleCode = (req, res, next) => {
  saleCode()
    .then(_res => {
      res.send(_res);
    })
    .catch(err => {
      next(err);
    });
};

exports.addSales = async (req, res, next) => {
  try {
      let _code = await saleCode();
      req.body.code = _code.code;
      req.body.active = true;
      const sale = new saleModel(req.body);
      await sale.save(); // Wait for the sale to be saved

      let itmLst = req.body['sale_items']; // Get the product list from the request body
      for (let i = 0; i < itmLst.length; i++) {
          await stockModel.findOneAndUpdate(
              { item: itmLst[i]['item'], size: itmLst[i]['size'], color: itmLst[i]['color'] },
              { $inc: { quantity: -itmLst[i]['quantity'] }},
              { new: true, runValidators: true, context: 'query' }
          );
      }
console.log(sale)
      res.send(sale); // Send response after updating stock items
  } catch (err) {
      next(err); // Forward error to error handler middleware
  }
};

exports.readSales = async (req, res, next) => {
  let _query = {};
  if (Object.keys(req.query).length) {
      _query = req.query;
      if (_query.active) _query.active = (_query.active == 'true' ? true : false);
      if (_query.fDate) {
        _query.bill_date = {
                    $gte: new Date(new Date(_query.fDate).setHours(0, 0, 0)),
                    $lt: new Date(new Date(_query.fDate).setHours(23, 59, 59))
            }
        delete _query['fDate'];
    }
      if (_query.from_date || _query.to_date) {
        _query.bill_date = {};
        if (_query.from_date) {
            _query.bill_date['$gte'] = new Date(_query.from_date);
            delete _query.from_date;
        }
        if (_query.to_date) {
            let tDate = new Date(_query.to_date);
            tDate.setDate(tDate.getDate() + 1);
            _query.bill_date['$lt'] = tDate;
            delete _query.to_date;
        }
    }
  }
  
  try {
      const r_sale = await saleModel.find(_query, '-active -updatedAt -__v');
      res.send(r_sale);
  } catch (err) {
      next(err);
  }
}
