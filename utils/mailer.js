var _ = require("lodash");
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "wrevan13@gmail.com",
      pass: "Arya@512",
    },
  });
  

var defaultMail = {
  from: "wrevan13@gmail.com",
};

const send = (to, subject, html) => {
  // use default setting
  mail = _.merge({ html }, defaultMail, to);

  // send email
  transporter.sendMail(mail, function (error, info) {
    if (error) return console.log(error);
    console.log("mail sent:", info.response);
  });
};
module.exports = {
  send,
};
