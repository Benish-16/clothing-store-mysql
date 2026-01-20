require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, textMessage, htmlContent = null) => {
  if (!email) {
    throw new Error("Recipient email is missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"MINIMAL" <${process.env.MY_EMAIL}>`,
    to: email,               
    subject,
    text: textMessage,      
    html: htmlContent || undefined,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
