module.exports = {
		up: (queryInterface, Sequelize) => queryInterface.createTable('Wallets', {
				id: {
						type: Sequelize.INTEGER(11),
						allowNull: false,
						primaryKey: true,
						autoIncrement: true,
				},
				userId: {
						type: Sequelize.INTEGER,
						allowNull: false,
				},
				walletId: {
						type: Sequelize.STRING,
						allowNull: false,
				},
				amount: {
						type: Sequelize.DOUBLE,
						allowNull: false,
				},
				minTransaction: {
						type: Sequelize.INTEGER,
						allowNull: true,
				},
				maxTransaction: {
						type: Sequelize.INTEGER,
				},
				limitTransactionPerDay: {
						type: Sequelize.INTEGER,
				},
				fee: {
						type: Sequelize.DOUBLE,
				},
				remark: {
						type: Sequelize.STRING,
				},
				createdAt:
						{
								type: Sequelize.DATE,
								field: 'created_at',
						},
				updatedAt: {
						type: Sequelize.DATE,
						field: 'updated_at',
				},
		}),
		down: (queryInterface, Sequelize) => queryInterface.dropTable('Wallets'),
};
