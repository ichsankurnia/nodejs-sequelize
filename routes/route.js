const { Router } = require('express');
const upload = require('./../app/helper/uploadFile')

// import middleware
const isAuthenticated = require('../app/middlewares/verify-token')
const auth = require('../app/middlewares/authenticate');
// import controller
const controllerUser = require('../app/controllers/controller-user')
const controllerPost = require('../app/controllers/controller-post')
const controllerCategory = require('../app/controllers/controller-category')

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
router.get('/activate-account/:id', controllerUser.activateAccount)

// post
router.get('/post',             isAuthenticated, controllerPost.getAllPost)
router.get('/post/:id',         isAuthenticated, controllerPost.getPostById)
router.post('/post',            isAuthenticated, upload.uploadImg('file'), controllerPost.createPost)
router.put('/post/:id',         isAuthenticated, upload.uploadImg('file'), controllerPost.updatePost)
// router.post('/post',            isAuthenticated, uploadFile.imgPostUpload('file'), controllerPost.createPost)
// router.put('/post/:id',         isAuthenticated, uploadFile.imgPostUpload('file'), controllerPost.updatePost)
router.delete('/post/:id',      isAuthenticated, controllerPost.deletePost)
router.delete('/truncate-post', isAuthenticated, controllerPost.truncatePosts)

// Category
router.get('/category',             isAuthenticated, controllerCategory.getAllCategories)
router.get('/category/:id',         isAuthenticated, controllerCategory.getCategoryById)
router.post('/category',            isAuthenticated, controllerCategory.createCategory)
router.put('/category/:id',         isAuthenticated, controllerCategory.updateCategory)
router.delete('/category/:id',      isAuthenticated, controllerCategory.deleteCategory)
router.delete('/truncate-category', isAuthenticated, controllerCategory.truncateCategories)

module.exports = router;