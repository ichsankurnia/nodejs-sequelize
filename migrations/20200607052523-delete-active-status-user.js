'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		Add altering commands here.
		Return a promise to correctly handle asynchronicity.

		Example:
		return queryInterface.createTable('users', { id: Sequelize.INTEGER });
		*/
		return queryInterface.removeColumn({
			tableName: 't_user',
			schema: 'sequelize_test'
		}, 'active_status_boo')
	},

	down: (queryInterface, Sequelize) => {
		/*
		Add reverting commands here.
		Return a promise to correctly handle asynchronicity.

		Example:
		return queryInterface.dropTable('users');
		*/
		return queryInterface.addColumn({tableName: 't_user', schema: 'sequelize_test'}, 'active_status_boo', {
			type: Sequelize.BOOLEAN,
			allowNull: false
		})
	}
};
