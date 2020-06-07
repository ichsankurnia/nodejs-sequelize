'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		Add altering commands here.
		Return a promise to correctly handle asynchronicity.

		Example:
		return queryInterface.bulkInsert('People', [{
			name: 'John Doe',
			isBetaMember: false
		}], {});
		*/
		return queryInterface.bulkInsert(
			{
				tableName: 't_user',
				schema: 'sequelize_test'
			}, 
			[
				{
					username_var: 'admin',
					password_var: 'admin123',
					email_var: 'example@example.com',
					token_text: '',
					created_at: new Date(),
					updated_at: new Date()
				}
			]
		);
	},

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete({tableName: 't_user', schema: 'sequelize_test'}, null, {})
  }
};
