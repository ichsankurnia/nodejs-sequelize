const { Router } = require('express');
const multer = require('multer');

// import middleware
const isAuthenticated = require('../app/middlewares/verify-token')
const auth = require('../app/middlewares/authenticate');
// import controller
const controllerUser = require('../app/controllers/controller-user')
const controllerPost = require('../app/controllers/controller-post')

const router = Router();

// default
router.get('/', (req, res) => res.status(200).json(
    { author: 'Ichsan Kurniawan', contact: 'kurniaichsan45@gmail.com', description: 'Rest API with nodejs express sequelize postgre' }
));

router.post('/auth', auth.login);

// user
router.get('/user',             isAuthenticated, controllerUser.getAllData);
router.get('/user/:id',         isAuthenticated, controllerUser.getDataById)
router.post('/user',                             controllerUser.createData)
router.put('/user/:id',         isAuthenticated, controllerUser.updateData)
router.delete('/user/:id',      isAuthenticated, controllerUser.deleteData)
router.delete('/truncate-user', isAuthenticated, controllerUser.truncateData)


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './tmp/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});

// var upload = multer({ dest: './public/assets/img/upload/' })
// var upload = multer({storage: storage}).single('file');     // file is req name
var upload = multer({storage: storage})

// post
router.get('/post',             isAuthenticated, controllerPost.getAllPost)
router.get('/post/:id',         isAuthenticated, controllerPost.getPostById)
router.post('/new-post',        isAuthenticated, controllerPost.createNewPost)
router.post('/post',            isAuthenticated, upload.single('file'), controllerPost.createPost)

module.exports = router;