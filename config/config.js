require('dotenv/config');
const fs = require('fs');

module.exports={
  development: {
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    dialect  : process.env.DB_CONNECTION,

    appUrl   : process.env.APP_URL,

    smtpOptions: {
      host     : process.env.MAIL_HOST,
      port     : process.env.MAIL_PORT,
      emailfrom: process.env.MAIL_FROM_ADDRESS,
      auth: {
        pass : process.env.MAIL_PASSWORD,
        user : process.env.MAIL_USERNAME,
      }
    }
  },
  test: {
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    dialect  : process.env.DB_CONNECTION,

    appUrl   : process.env.APP_URL,

    smtpOptions: {
      mailhost : process.env.MAIL_HOST,
      mailport : process.env.MAIL_PORT,
      password : process.env.MAIL_PASSWORD,
      username : process.env.MAIL_USERNAME,
      emailfrom: process.env.MAIL_FROM_ADDRESS,
      mailfname: process.env.MAIL_FROM_NAME
    }
  },
  production: {
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    dialect  : process.env.DB_CONNECTION,

    appUrl   : process.env.APP_URL,

    smtpOptions: {
      mailhost : process.env.MAIL_HOST,
      mailport : process.env.MAIL_PORT,
      password : process.env.MAIL_PASSWORD,
      username : process.env.MAIL_USERNAME,
      emailfrom: process.env.MAIL_FROM_ADDRESS,
      mailfname: process.env.MAIL_FROM_NAME
    }
  },

  jwtSecret: process.env.JWT_SECRET_KEY,
}
