const nodemailer = require('nodemailer');
const env        = process.env.NODE_ENV || 'development';
const config     = require(__dirname + '/config')[env];

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.smtpOptions.emailfrom}) {
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}