

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			employeeCode: {
					type: Sequelize.STRING,
					allowNull: false,
			},
			employeeName: {
					type: Sequelize.STRING,
					allowNull: false,
			},
			idCard: { type: Sequelize.STRING, allowNull: false },
			nickName: { type: Sequelize.STRING, allowNull: true },
			tel: { type: Sequelize.STRING, allowNull: true },
			email: { type: Sequelize.STRING, allowNull: true },
			user_image: { type: Sequelize.STRING, allowNull: true },
			birthDate: { type: Sequelize.DATE, allowNull: true },
			age: { type: Sequelize.STRING, allowNull: true },
			startJobDate: { type: Sequelize.DATE, allowNull: true },
			Role: { type: Sequelize.STRING, allowNull: true },
			address: { type: Sequelize.STRING },
			remark: { type: Sequelize.STRING },
			gender: {
				type: Sequelize.ENUM('male', 'female'),
			},
			username: { type: Sequelize.STRING, allowNull: false },
			password: {
				type: Sequelize.STRING,
			},
			last_login_date: {
				type: Sequelize.DATE,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			role_id: {
				type: Sequelize.INTEGER,
				onDelete: 'NO ACTION',
			},
	}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
