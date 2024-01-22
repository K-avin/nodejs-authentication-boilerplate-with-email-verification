const path     = require('path')
var nodemailer = require('nodemailer');
var hbs        = require('nodemailer-express-handlebars');
const env      = process.env.NODE_ENV || 'development';
const config   = require(__dirname + '/config')[env];

var transporter = nodemailer.createTransport(config.smtpOptions);

const handlebarOptions = {
    viewEngine: {
        extName      : ".handlebars",
        partialsDir  : path.resolve('./mail'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./mail'),
    extName : ".handlebars",
}

transporter.use('compile', hbs(handlebarOptions));

async function mailHandler(url, template, subject, toMail, userData) {
    try {
        const mailOptions = {
            from    : config.smtpOptions.emailfrom,
            to      : toMail,
            subject : subject,
            template: template,
            context : {
                userData : userData,
                verifyUrl: url,
            }
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) { throw error }
}

module.exports = { mailHandler };