'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('t_categories', {
				category_id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				category_name: {
					type: Sequelize.STRING,
					unique: true,
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
				schema: 'sequelize_test'
			}
		);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('t_categories', {schema: 'sequelize_test'});
	}
};