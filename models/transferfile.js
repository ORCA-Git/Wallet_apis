module.exports = (sequelize, DataTypes) => {
  const TransferFile = sequelize.define('TransferFile', {
    tranferId: DataTypes.INTEGER,
    fileName: DataTypes.TEXT,
    status: DataTypes.STRING,
  }, {});
  TransferFile.associate = function (models) {
    // associations can be defined here
  };
  return TransferFile;
};
