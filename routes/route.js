const { Router } = require('express');

// import middleware
const isAuthenticated = require('../app/middlewares/verify-token')
const auth = require('../app/middlewares/authenticate');
// import controller
const controllerUser = require('../app/controllers/user')

const router = Router();

// default
router.get('/', (req, res) => res.status(200).json(
    { author: 'Ichsan Kurniawan', contact: 'kurniaichsan45@gmail.com', description: 'Rest API with nodejs express sequelize postgre' }
));

router.post('/auth', auth.login);

// user
router.post('/user', controllerUser.createData)
router.get('/user', isAuthenticated, controllerUser.getAllData);
router.get('/user/:id', isAuthenticated, controllerUser.getDataById)

module.exports = router;