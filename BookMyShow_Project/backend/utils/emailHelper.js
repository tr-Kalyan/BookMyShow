const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv").config({path: "../.env"});
const {SENDGRID_API_KEY,EMAIL_FROM,TEST_MODE,TEST_MAIL,TEST_NAME} = process.env

function replaceContent(content, creds){
  let allKeys = Object.keys(creds); //[name,otp];
  allKeys.forEach((key)=> {
    content = content.replace(`##${key}`, creds[key])});
  return content
}
async function emailHelper(templateName, receiverEmail, creds) {
  try {
    const templatePath = path.join(__dirname,"email_templates", templateName+".html");
    let content = await fs.promises.readFile(templatePath,"utf-8");
    const transportDetails = {
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: SENDGRID_API_KEY,
      },
    };

    const emailDetails = {
      from: EMAIL_FROM, // sender address
      to: receiverEmail, // list of receivers
      subject: "Mail from ScalerShows", // Subject line
      text: `Hi ${creds.name} this is your reset otp ${creds.otp}`, // plain text body
      html:replaceContent(content, creds) // html body
    };
    const transporter = nodemailer.createTransport(transportDetails);
    // send mail with defined transport object
    await transporter.sendMail(emailDetails);
  } catch (err) {
    console.log(err);
  }
}


// Only run test email if TEST_MODE is enabled
if (process.env.TEST_MODE === 'true') {
  emailHelper(
    "otp",
    process.env.TEST_EMAIL,
    {
      "name": process.env.TEST_NAME,
      "otp": "1234"
    }
  );
}

module.exports = emailHelper;