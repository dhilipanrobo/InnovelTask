const nodemailer = require('nodemailer');
//const { emailUser, emailPass } = require('../config');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "dhilipanpyro@gmail.com",
    pass: "bsws eowx gebl oumi",
  },
});

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: "dhilipanpyro@gmail.com",
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
