
module.exports = (sequelize, DataTypes) => {
  const activity_log = sequelize.define('activity_log', {
    action: DataTypes.STRING,
    description: DataTypes.STRING,
    user: DataTypes.STRING,
    date: DataTypes.DATE,
  }, {});
  activity_log.associate = function (models) {
    // associations can be defined here
  };
  return activity_log;
};
