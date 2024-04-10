const { companyModel } =require("../model/company");


exports.addCompany = async (req, res, next) => {
    req.body.active = true;
    const filter = {}; 
    const options = {
      upsert: true,       // Create if not exists
      new: true,          // Return updated document
      runValidators: true,// Validate the update operation
      context: 'query'    // Ensure validation occurs
    };
  
    try {
      const r_company = await companyModel.findOneAndUpdate(filter, req.body, options);
      res.send(r_company);
    } catch (err) {
      next(err);
    }
  }
  

  exports.readCompany = async (req, res, next) => {
    let _query = {};
    
    if (Object.keys(req.query).length) {
        _query = req.query;
        if (_query.active) _query.active = (_query.active == 'true' ? true : false);
    }
    
    try {
        const r_company = await companyModel.findOne(_query, '-active -updatedAt -__v');
        res.send(r_company);
    } catch (err) {
        next(err);
    }
}
