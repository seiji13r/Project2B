module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    salt: {
      type: DataTypes.STRING
    },
    currentDay: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  });

  User.associate = function(models) {
    User.belongsToMany(models.Movie, {
      through: models.UserMovie
    });
  };

  return User;
};
