'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refreshTokens', {
      id             : { autoIncrement: true, primaryKey: true, allowNull: false, type: Sequelize.INTEGER,},
      token          : { type: Sequelize.STRING },
      expires        : { type: Sequelize.DATE },
      createdByIp    : { type: Sequelize.STRING },
      revoked        : { type: Sequelize.DATE },
      revokedByIp    : { type: Sequelize.STRING },
      replacedByToken: { type: Sequelize.STRING },
      created        : { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('refreshTokens');
  },
};
