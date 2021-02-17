
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Wallet_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      walletId: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.STRING,
      },
      user: {
        type: Sequelize.STRING,
      },
      createdDate: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Wallet_histories'),
};
