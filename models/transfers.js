module.exports = (sequelize, DataTypes) => {
  const Transfers = sequelize.define('Transfers', {
    order_no: DataTypes.STRING,
    invoice: DataTypes.STRING,
    rate: DataTypes.DOUBLE,
    fee: DataTypes.DOUBLE,
    receipt_date: DataTypes.DATE,
    to_customer: DataTypes.STRING,
    from_partner: DataTypes.STRING,
    reason: DataTypes.TEXT,
    submited: DataTypes.TEXT,
    sms: DataTypes.TEXT,
    coupon: DataTypes.STRING,
    transaction_date: DataTypes.DATE,
  }, {});
  Transfers.associate = function (models) {
    // associations can be defined here
  };
  return Transfers;
};
