module.exports = (sequelize, DataTypes) => {
  const Transfers = sequelize.define('Transfers', {
    order_no: DataTypes.STRING,
    invoice: DataTypes.STRING,
    partnerId: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
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
    customer_bank: DataTypes.STRING,
    customer_account: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    customer_tel: DataTypes.STRING,
    customer_subdistrict: DataTypes.STRING,
    customer_country: DataTypes.STRING,
    customer_postcode: DataTypes.STRING,
    customer_name: DataTypes.STRING,
    customer_address: DataTypes.STRING,
    customer_state: DataTypes.STRING,
    customer_remark: DataTypes.STRING,
    slip: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {});
  Transfers.associate = function (models) {
    // associations can be defined here
  };
  return Transfers;
};
