
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Transfers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_no: {
        type: Sequelize.STRING,
      },
      invoice: {
        type: Sequelize.STRING,
      },
      partnerId: Sequelize.STRING,
      amount: {
          type: Sequelize.DOUBLE,
      },
      rate: {
        type: Sequelize.DOUBLE,
      },
      fee: {
        type: Sequelize.DOUBLE,
      },
      receipt_date: {
        type: Sequelize.DATE,
      },
      to_customer: {
        type: Sequelize.STRING,
      },
      from_partner: {
        type: Sequelize.STRING,
      },
      reason: {
        type: Sequelize.TEXT,
      },
      submited: {
        type: Sequelize.TEXT,
      },
      sms: {
        type: Sequelize.TEXT,
      },
      coupon: {
        type: Sequelize.STRING,
      },
      transaction_date: {
        type: Sequelize.DATE,
      },
      customer_bank: Sequelize.STRING,
      customer_account: Sequelize.STRING,
      customer_id: Sequelize.STRING,
      customer_tel: Sequelize.STRING,
      customer_subdistrict: Sequelize.STRING,
      customer_country: Sequelize.STRING,
      customer_postcode: Sequelize.STRING,
      customer_name: Sequelize.STRING,
      customer_address: Sequelize.STRING,
      customer_state: Sequelize.STRING,
      customer_remark: Sequelize.STRING,
      slip: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
          type: Sequelize.STRING,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Transfers'),
};
