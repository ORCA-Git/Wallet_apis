module.exports = (sequelize, DataTypes) => sequelize.define('Wallets', {
		id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
		},
		userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
		},
		walletId: {
				type: DataTypes.STRING,
				allowNull: false,
		},
		amount: {
				type: DataTypes.DOUBLE,
				allowNull: false,
		},
		minTransaction: {
				type: DataTypes.INTEGER,
				allowNull: true,
		},
		maxTransaction: {
				type: DataTypes.INTEGER,
		},
		limitTransactionPerDay: {
				type: DataTypes.INTEGER,
		},
		fee: {
				type: DataTypes.DOUBLE,
		},
		remark: {
				type: DataTypes.STRING,
		},
		createdAt:
				{
						type: DataTypes.DATE,
						field: 'created_at',
				},
		updatedAt: {
				type: DataTypes.DATE,
				field: 'updated_at',
		},

}, {});
