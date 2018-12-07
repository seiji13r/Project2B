module.exports = function(sequelize, DataTypes) {
  var UserMovie = sequelize.define("UserMovie", {
    isSeenAlready: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    wannaWatch: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  return UserMovie;
};
