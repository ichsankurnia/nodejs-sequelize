'use strict';

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        username_var: {
            type: DataTypes.STRING(20),
            allowNull: false,
			unique: true,
			validate: {
				// isAlphanumeric: true,
				// isLowercase: true,
				notNull: true,
				// notEmpty: true,
				max: 20,
				min: 5
			}
        },
        password_var: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email_var: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        token_text: {
            type: DataTypes.TEXT,
            allowNull: true 
        },
        createdAt:{
            type: DataTypes.DATE,allowNull: true, defaultValue: DataTypes.DATE.NOW
        },
        updatedAt:{
            type: DataTypes.DATE,allowNull: true, defaultValue: DataTypes.DATE.NOW
        }
    }, 
    { 
        schema: 'sequelize_test',
        tableName: 't_user',
		underscored: true
    });

    User.removeAttribute('id');
	// User.removeAttribute('createdAt');
	// User.removeAttribute('updatedAt');

	// User.associate = function(models) {
	//       User.hasMany(models.UserSetting, {
	// 		foreignKey: 'user_id',
	// 		onDelete: 'CASCADE',
	//       });

	// 	User.belongsTo(models.UserGroup, {
	// 		foreignKey: 'user_group_id',
	// 		onDelete: 'CASCADE',
	//       });

	//       User.belongsTo(models.Employees, {
	// 		foreignKey: 'employee_id',
	// 		onDelete: 'CASCADE',
	// 	});
	// };

	return User;
};