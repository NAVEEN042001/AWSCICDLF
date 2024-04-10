const jwt = require("jsonwebtoken");
const { userModel } = require('../model/user');

module.exports = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization.replace("Bearer ", "");
    let user = await userModel.findById(jwt.verify(authToken, process.env.JWT_KEY)['userID']);
    // let tenantName = jwt.verify(authToken, process.env.JWT_KEY)['tenant'];
    // console.log(tenantName); //this can be used for multi tenant framework
    if(user) {
      req.userID = user._id; // req.userID can be object - req.userData = { email: decodedToken.email, userID: decodedToken.userID };
      next();
    } else {
      throw new Error ('User Not Found !!!');
    }
  } catch(err) {
    console.log(err);
    return res.status(401).json({
      message: "Unauthorised !!!"
    });
  }
}