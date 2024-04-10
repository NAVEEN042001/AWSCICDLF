
const Q = require('q');
const bcrypt = require('bcrypt');
const { userModel } = require('../model/user');
const { loginModel } = require('../model/login');
const { codeLengthPad, genRandomPassword } = require('../service/generic');

function readUserCode() {
  var deferred = Q.defer();
  userModel.find({code: {$regex : "^US-"}})
  .sort({$natural: -1})
  .limit(1)
  .exec((err, r_job) => {
      if(err) deferred.reject(err);
      else if(r_job) {
          let seqNum = '001';
          if(r_job.length) {
              let _job = r_job[0].code.split('-');
              seqNum = codeLengthPad(parseInt(_job[_job.length - 1]) + 1, 3)
          }
          deferred.resolve({code: 'US-' + seqNum});
      }
  })
  return deferred.promise;
}

exports.addUser = async (req, res, next) => {
    const _code = await readUserCode();
    req.body.code = _code.code;
    req.body.active = true;
    req.body.createdBy = req.userID;
    let user = new userModel(req.body);
    user.save()
    .then(async userRes  => {
        try {
            //login
            let randomPasswd = await genRandomPassword(6, false, false, false);
            let hashPasswd = await bcrypt.hash(randomPasswd, parseInt(process.env.SALT_ROUNDS));
            let login = new loginModel({
                refName: 'master_user',
                refID: userRes._id,
                email: userRes.email,
                password: hashPasswd,
                active: true,
                createdBy: req.userID,
                updatedBy: req.userID
            })
            await login.save();
            if(err) {
                next(err);
              } else {
                console.log('INFO: registered successfully');
                res.send(userRes);
              }
        } catch(err) {
            await loginModel.deleteOne({refID: userRes._id});
            await userModel.deleteOne({_id: userRes._id});
            next(err);
        }
    })
    .catch(err => {
        next(err);
    });
}

exports.readUser = (req, res, next) => {
    let _query = {};
    if(Object.keys(req.query).length) {
        _query = req.query;
        if(_query.active) _query.active = (_query.active == 'true' ? true: false);
    }

    userModel.find(_query, '-active -createdBy -updatedBy -createdAt -updatedAt -__v', (err, r_user) => {
        if(err) {
            next(err);
        } else {
            res.send(r_user);
        }
    });
}

exports.readUserCode = (req, res, next) => {
    readUserCode()
    .then(_res => {
        res.send(_res);
    })
    .catch(err => {
        next(err);
    })
}

exports.readLoggedinUser = (req, res, next) => {
    userModel.findById(req.userID, '-active -createdBy -updatedBy -createdAt -updatedAt -__v', (err, r_user) => {
        if(err) {
            next(err);
        } else {
            res.send(r_user);
        }
    });
}