'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('t_post', {
				post_id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.BIGINT
				},
				post_title: {
					type: Sequelize.STRING
				},
				post_body: {
					type: Sequelize.TEXT
				},
				thumbnail_url: {
					type: Sequelize.STRING,
					allowNull: true
				},
				author: {
					type: Sequelize.BIGINT,
					allowNull: true,
				},
				category_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				likes: {
					type: Sequelize.BIGINT
				},
				comments: {
					type: Sequelize.BIGINT
				},
				views: {
					type: Sequelize.BIGINT
				},
				createdAt: {
					allowNull: true,
					type: Sequelize.DATE
				},
				updatedAt: {
					allowNull: true,
					type: Sequelize.DATE
				}
			},
			{
				schema: 'sequelize_test',
			}
		);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('posts');
	}
};