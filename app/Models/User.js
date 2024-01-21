'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email            : { type: DataTypes.STRING, unique: true, allowNull: false },
    password         : { type: DataTypes.STRING, allowNull: false },
    firstName        : { type: DataTypes.STRING, allowNull: false },
    lastName         : { type: DataTypes.STRING, allowNull: false },
    acceptTerms      : { type: DataTypes.BOOLEAN },
    role             : { type: DataTypes.STRING, allowNull: false },
    verificationToken: { type: DataTypes.STRING },
    verified         : { type: DataTypes.DATE },
    resetToken       : { type: DataTypes.STRING },
    resetTokenExpires: { type: DataTypes.DATE },
    passwordReset    : { type: DataTypes.DATE },
    created          : { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated          : { type: DataTypes.DATE },
    isVerified       : {
        type: DataTypes.VIRTUAL,
        get() { return !!(this.verified || this.passwordReset); }
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
    defaultScope: {
      // exclude password hash by default
      attributes: { exclude: ['password'] }
    },
    scopes: {
        // include hash with this scope
        withHash: { attributes: {}, }
    }

  })
  User.associate = function (models) {
    User.hasMany(models.refreshTokens, { onDelete: 'CASCADE' });
  };
  
  return User;
};