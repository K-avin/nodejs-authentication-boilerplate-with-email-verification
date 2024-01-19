'use strict';
module.exports = (sequelize, DataTypes) => {
  const refreshTokens = sequelize.define('refreshTokens', {
    token          : { type: DataTypes.STRING },
    expires        : { type: DataTypes.DATE },
    created        : { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    createdByIp    : { type: DataTypes.STRING },
    revoked        : { type: DataTypes.DATE },
    revokedByIp    : { type: DataTypes.STRING },
    replacedByToken: { type: DataTypes.STRING },
    isExpired      : {
      type: DataTypes.VIRTUAL,
      get() { return Date.now() >= this.expires; }
    },
    isActive       : {
      type: DataTypes.VIRTUAL,
      get() { return !this.revoked && !this.isExpired; }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'refreshTokens',
    timestamps: false,

  })
  refreshTokens.associate = function (models) {
    refreshTokens.belongsTo(models.User)
  };
  
  return refreshTokens;
};