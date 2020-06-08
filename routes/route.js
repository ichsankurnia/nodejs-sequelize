const { Router } = require('express');

// import middleware
const isAuthenticated = require('../app/middlewares/verify-token')
const auth = require('../app/middlewares/authenticate');
// import controller
const controllerUser = require('../app/controllers/controller-user')

const router = Router();

// default
router.get('/', (req, res) => res.status(200).json(
    { author: 'Ichsan Kurniawan', contact: 'kurniaichsan45@gmail.com', description: 'Rest API with nodejs express sequelize postgre' }
));

router.post('/auth', auth.login);

// user
router.get('/user', isAuthenticated, controllerUser.getAllData);
router.get('/user/:id', isAuthenticated, controllerUser.getDataById)
router.post('/user', controllerUser.createData)
router.put('/user/:id', isAuthenticated, controllerUser.updateData)

module.exports = router;