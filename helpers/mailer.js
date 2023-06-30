const nodemailer = require('nodemailer')


const trasporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = trasporter