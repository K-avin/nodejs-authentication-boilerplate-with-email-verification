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

async function verificationMail(user, baseUrl) {
    try {
        const mailOptions = {
            from    : config.smtpOptions.emailfrom,
            to      : user.email,
            subject : 'Email Address Verification',
            template: 'verify',
            context : {
                userData : user.firstName,
                verifyUrl: `${baseUrl}/api/v1.0/auth/verify-email?token=${user.verificationToken}`,
            }
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) { throw error }
}

async function alreadyRegisteredMail(email, baseUrl) {
    try {
        const mailOptions = {
            from    : config.smtpOptions.emailfrom,
            to      : email,
            subject : 'Email Already Registered',
            template: 'forgot',
            context : {
                userData : email,
                verifyUrl: `${baseUrl}/api/v1.0/auth/forgot-password`,
            }
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) { throw error }
}

async function resetPasswordMail(user, baseUrl) {
    try {
        const mailOptions = {
            from    : config.smtpOptions.emailfrom,
            to      : user.email,
            subject : 'Reset Password',
            template: 'reset',
            context : {
                userData : user.firstName,
                verifyUrl: `${baseUrl}/api/v1.0/auth/reset-password?token=${user.resetToken}`,
            }
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) { throw error }
}

module.exports = { verificationMail, alreadyRegisteredMail, resetPasswordMail };