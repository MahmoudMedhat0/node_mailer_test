const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const verifcationToken = async (req, res, next) => {
  // console.log(req.headers.authorization)
  let authorization = req.headers.authorization;
  if (authorization) {
    try {
      let token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.header = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.log(err.message);
      res.status(401).json({
        success: false,
        msg: "Session Expired",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      msg: "no token, Not Authorized",
    });
  }
};

module.exports = { verifcationToken };
