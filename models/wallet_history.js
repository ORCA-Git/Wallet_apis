module.exports = (sequelize, DataTypes) => {
  const WalletHistory = sequelize.define('Wallet_history', {
    walletId: DataTypes.STRING,
    amount: DataTypes.STRING,
    user: DataTypes.STRING,
    createdDate: DataTypes.DATE,
  }, {});
  WalletHistory.associate = function (models) {
    // associations can be defined here
    console.log(models);
  };
  return WalletHistory;
};
