const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');

var { loginModel } = require('../model/login');
var { userModel } = require('../model/user');

exports.userLogin = (req, res, next) => {
  try {
    loginModel.findOne({ email: req.body.email })
    .then(usr => {
      if(!usr) {
        res.status(401).send('Invalid email');
      } else {
        bcrypt.compare(req.body.password, usr.password)
        .then(password => {
          if(!password) {
            res.status(401).send('Invalid password');
          } else {
            //as part of successfull login set the tenant name in the token
            // const token = jwt.sign({userID: usr.refID._id, tenant: 'tenant1'}, process.env.JWT_KEY, { expiresIn: "24d" }); //master_user ID
            const token = jwt.sign({userID: usr.refID._id, tenant: 'tenant1'}, process.env.JWT_KEY); //master_user ID
            res.status(200).json({
              token: token,
              user: usr['refID'], //this is rquired by the mobile app
            });
          }
        })
      }
    })
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.userLogout = (req, res, next) => {
  loginModel.findOne({ refID  : req.userID })
  .then(usr => {
    if(!usr) {
      console.log("logout failure");
    } else {
      // jwt.destroy(req.headers.authorization.replace("Bearer ", ""));
      // jwt.decode(req.headers.authorization, {complete: true});
      console.log("logout success");
      res.send(usr.refID);
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
}

// exports.changePassword = async (req, res, next) => {
//   try {
//     let currentpassword = req.body.currentpassword.trim();
//     let loginUser = await loginModel.findOne({ refID: req.userID });
//     if (!loginUser) {
//         res.status(401).json({ error: 'User not found.' });
//         return;
//     }
//     const passwordMatch = await bcrypt.compare(currentpassword, loginUser.password);
//     if (!passwordMatch) {
//       res.status(401).json({ error: 'Incorrect password.' });
//       return;
//     }

//     let newpassword = req.body.newpassword;
//     let hashPasswd = await bcrypt.hash(newpassword, parseInt(process.env.SALT_ROUNDS));
//     await loginModel.findOneAndUpdate({ refID: req.userID }, { password: hashPasswd });
//     res.send({ message: 'Password changed successfully.' });
//   } catch (err) {
//     next(err); // Handle the error using your error middleware
//   }
// }

exports.renewToken = async (req, res, next) => {
  const user = await userModel.findOne({_id: req.body._id});
  const token = jwt.sign({userID: user._id, tenant: 'tenant1'}, process.env.JWT_KEY, { expiresIn: "24d" }); //master_user ID
  res.status(200).json({
    token: token,
    user: user, //this is rquired by the mobile app
  });
}