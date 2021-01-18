
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Transfers'),
};
