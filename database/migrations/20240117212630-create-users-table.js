'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id               : { autoIncrement: true, primaryKey: true, allowNull: false, type: Sequelize.INTEGER,},
      email            : { type: Sequelize.STRING, unique: true, allowNull: false },
      password         : { type: Sequelize.STRING, allowNull: false },
      firstName        : { type: Sequelize.STRING, allowNull: false },
      lastName         : { type: Sequelize.STRING, allowNull: false },
      acceptTerms      : { type: Sequelize.BOOLEAN },
      role             : { type: Sequelize.STRING, allowNull: false },
      verificationToken: { type: Sequelize.STRING },
      verified         : { type: Sequelize.DATE },
      resetToken       : { type: Sequelize.STRING },
      resetTokenExpires: { type: Sequelize.DATE },
      passwordReset    : { type: Sequelize.DATE },
      created          : { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated          : { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
