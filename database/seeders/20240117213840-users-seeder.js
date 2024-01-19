'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          firstName        : 'Kabilraj',
          lastName         : 'Selvanantham',
          email            : 'admin@example.com',
          acceptTerms      : true,
          verificationToken: null,
          verified         : new Date(),
          resetToken       : null,
          resetTokenExpires: null,
          passwordReset    : null,
          role             : 'Admin',
          password         :
            '$2a$08$OfzRGp2mIMG5SbwZRvZfp.EXozR0bmFBDMPHwLSDoyiXbqAgj.6US', // secret
          created          : new Date(),
          updated          : null
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
