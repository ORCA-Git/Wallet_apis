module.exports = (sequelize, DataTypes) => {
  const Partners = sequelize.define('Partners', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secretKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
    },
    joinDate: {
      type: DataTypes.DATE,
    },
    expireDate: {
      type: DataTypes.DATE,
    },
    Address: {
      type: DataTypes.TEXT,
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
  Partners.associate = function (models) {
    // associations can be defined here
  };
  return Partners;
};
