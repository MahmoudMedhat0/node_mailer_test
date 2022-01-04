const generateToken = require("../utils/generateToken.js");
const User = require("../models/userModel.js");
var crypto = require("crypto");
var mailer = require("../utils/mailer");

const registerUser = async (req, res, next) => {
  try {
    const { name, password, email } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists && userExists.active) {
      return res.status(400).json({
        success: false,
        mgs: "Entered email id is already registered with us. Login to continue.",
      });
    } else if (userExists && !userExists.active) {
      return res.status(400).json({
        success: false,
        mgs: "Acount created but need to activate, A Link sent with your registed email.",
      });
    }

    const user = new User(req.body);
    crypto.randomBytes(20, function (err, buf) {
      user.activeToken = user._id + buf.toString("hex");
      user.activeExpires = Date.now() + 24 * 3600 * 1000;
      var link =
        process.env.NODE_ENV === "dev"
          ? `http://localhost:${process.env.PORT}/api/users/active/${user.activeToken}`
          : `${process.env.api_host}/api/users/active/${user.activeToken}`;

      mailer.send({
        to: req.body.email,
        subject: "Welcome",
        html:
          'Please click <a href="' + link + '">here</a> to active your acount',
      });
      user.save((err, user) => {
        if (err) {
          return next(err);
        }
        res.status(201).json({
          success: true,
          msg:
            "this activation link has been sent to " +
            user.email +
            "please click to activation link",
        });
      });
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const activeToken = async (req, res, next) => {
  await User.findOne({ activeToken: req.params.activeToken }, (err, user) => {
    if (err) next(err);
    if (!user)
      return res.status(400).json({
        success: false,
        mgs: "Your activated link is not valid",
      });

    if (user.active === true)
      return res.status(200).json({
        success: true,
        mgs: "Your account already activated, please go and login",
      });

    user.active = true;
    user.save((err, user) => {
      if (err) next(err);
      res.status(200).json({
        success: true,
        mgs: "Activation Success",
      });
    });
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.active && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatr,
      token: generateToken(user._id),
    });
  } else if (user && !user.active) {
    res.json({
      success: false,
      mgs: "please verify your acount.",
    });
  } else {
    res.json({
      success: false,
      mgs: "unauthorized user",
    });
  }
};

const getUserProfile = async (req, res, next) => {
  const user = await User.findOne(req.headers.id);
  if (user) {
    return res.status(200).json({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } else {
    res.status(404).json({
      success: false,
      msg: "user not found",
    });
  }
};
module.exports = { registerUser, activeToken, login, getUserProfile };
