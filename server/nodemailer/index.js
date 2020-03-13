const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const mailOptions = receiver => ({
  from: process.env.EMAIL, // sender address
  to: receiver, // list of receivers
  subject: "Subject of your email", // Subject line
  html: "<p>Your html here</p>" // plain text body
});

exports.sentReviewer = receiver => {
  console.log("receiver==> ", receiver);
  console.log("receiver==> ", receiver);
  transporter.sendMail(mailOptions(receiver), function(err, info) {
    if (err) console.log(err);
    else console.log(info);
    return info;
  });
};

exports.verifyEmail = () => {};

exports.resetPassword = () => {};
