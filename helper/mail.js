const mailer = require("nodemailer");
require("dotenv").config();

sendMail = (email, subject, text) => {
  let transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.my_mail,
      pass: process.env.my_pass,
    },
  });

  let mailDetail = {
    from: process.env.my_mail,
    to: email,
    subject: subject,
    text: text,
  };
  
  transporter.sendMail(mailDetail, (err, info) => {
    if (err) throw err;
    console.log("Mail sent! ", info.response);
  });
};

module.exports = {
  sendMail: sendMail,
};
