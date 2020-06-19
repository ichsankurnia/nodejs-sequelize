'use strict';
module.exports = (sequelize, DataTypes) => {
	const category = sequelize.define('Category', {				// => Category is object not table
		category_id : {
			type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
		},
		category_name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isAlphanumeric: false,
				notNull: true,
				notEmpty: true,
				max: 15,
				min: 3
			}
		},
		createdAt:{
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: DataTypes.DATE.NOW
        },
        updatedAt:{
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: DataTypes.DATE.NOW
		}
	}, {
		schema: 'sequelize_test',
        tableName: 't_categories',
		underscored: true
	});

	category.removeAttribute('id');

	category.associate = function(models) {
		
		category.hasMany(models.Post, {
			foreignKey: 'category_id',
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE'
		});
	};

	
	return category;
};