'use strict';
module.exports = (sequelize, DataTypes) => {
	const post = sequelize.define('Post', {
			post_id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true
			},
			post_title: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notNull: true,
					notEmpty: true,
					max: 15,
					min: 3
				}
			},
			post_body: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			thumbnail_url: {
				type: DataTypes.STRING,
				allowNull: true
			},
			user_id: {
				type: DataTypes.BIGINT,
				allowNull: true,
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			like_count: {
				type: DataTypes.BIGINT,
				allowNull: true,
				defaultValue: 0
			},
			comment_count: {
				type: DataTypes.BIGINT,
				allowNull: true,
				defaultValue: 0
			},
			view_count: {
				type: DataTypes.BIGINT,
				allowNull: true,
				defaultValue: 0
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
            },
		},{
			schema: 'sequelize_test',
			tableName: 't_post',
			underscored: true
		}
	);

	post.removeAttribute('id');

	post.associate = function(models) {
		// associations can be defined here
		post.belongsTo(models.User, {
			foreignKey: 'user_id',
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE'
		})
		
		post.belongsTo(models.Category, {
			foreignKey: 'category_id',
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE'
		})
	};

	
	return post;
};