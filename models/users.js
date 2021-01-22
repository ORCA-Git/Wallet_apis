module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define('Users', {
			id: {
					type: DataTypes.INTEGER(11),
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
			},
			employeeCode: {
					type: DataTypes.STRING,
					allowNull: false,
			},
			employeeName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			idCard: { type: DataTypes.STRING, allowNull: false },
			nickName: { type: DataTypes.STRING, allowNull: true },
			tel: { type: DataTypes.STRING, allowNull: true },
			email: { type: DataTypes.STRING, allowNull: true },
			user_image: { type: DataTypes.STRING, allowNull: true },
			birthDate: { type: DataTypes.DATE, allowNull: true },
			age: { type: DataTypes.STRING, allowNull: true },
			startJobDate: { type: DataTypes.DATE, allowNull: true },
			Role: { type: DataTypes.STRING, allowNull: true },
			address: { type: DataTypes.STRING },
			remark: { type: DataTypes.STRING },
			gender: {
				type: DataTypes.ENUM('male', 'female'),
			},
			username: { type: DataTypes.STRING, allowNull: false },
			password: {
					type: DataTypes.STRING,
			},
			last_login_date: { type: DataTypes.DATE },
			createdAt: { type: DataTypes.DATE, field: 'created_at' },
			updatedAt: {
				type: DataTypes.DATE,
				field: 'updated_at',
			},
	}, {});
	Users.associate = function (models) {
		Users.hasMany(models.Roles, {
			foreignKey: 'role_id',
		});
	};
	return Users;
};
