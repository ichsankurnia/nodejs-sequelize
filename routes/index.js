const { Router } = require('express');
const controllerUser = require('../app/controllers/user')

const router = Router();

// default
router.get('/', (req, res) => res.status(200).json(
    { author: 'Ichsan Kurniawan', contact: 'kurniaichsan45@gmail.com', description: 'Rest API with nodejs express sequelize postgre' }
));

// user
router.get('/user', controllerUser.getAllData);

module.exports = router;