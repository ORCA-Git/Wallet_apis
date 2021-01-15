module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Partners', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    secretKey: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    partnerName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contactName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tel: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
    },
    joinDate: {
      type: Sequelize.DATE,
    },
    expireDate: {
      type: Sequelize.DATE,
    },
    Address: {
      type: Sequelize.TEXT,
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
    role_id: {
      type: Sequelize.INTEGER,
      onDelete: 'NO ACTION',
    },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Partners'),
};
