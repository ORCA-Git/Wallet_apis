module.exports = (sequelize, DataTypes) => {
	const Roles = sequelize.define('Roles', {
		roleName: DataTypes.STRING,
	}, {});
	Roles.associate = function (models) {
		// eslint-disable-next-line no-console
		// associations can be defined here
	};
	return Roles;
};
