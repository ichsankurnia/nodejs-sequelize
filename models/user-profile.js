'use strict';

module.exports = (sequelize, DataTypes) => {
	const UserProfile = sequelize.define('UserProfile', {
        profile_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
        },
        img_profile: {
            type: DataTypes.STRING,
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
        tableName: 't_user_profile',
		underscored: true
    });

    UserProfile.removeAttribute('id');

	UserProfile.associate = function(models) {
        UserProfile.belongsTo(models.User, {
			foreignKey: 'profile_id'
        })
    }
	return UserProfile;
};