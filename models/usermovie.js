module.exports = function(sequelize, DataTypes) {
  var UserMovie = sequelize.define("UserMovie", {
    isSeenAlready: { type: DataTypes.BOOLEAN },
    wannaWatch: { type: DataTypes.BOOLEAN }
  });
  return UserMovie;
};