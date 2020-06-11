const multer = require('multer');
const fs = require('fs');
const path = require('path')

const models = require('../../models')
// const upload = multer({ dest: '/tmp/'});

//set storage engine
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../..public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage}).single('file');     // file is req name

const createNewPost = async (req, res) => {
    try {
        console.log("Req Body => ", req.body)
        const {title, body, author, category_id} = req.body
        // const file = global.appRoot + '/uploads/' + req.file.filename;
        console.log("Req file => ", req.file)

        if(req.file){
            console.log("Req file => ", req.file)
            const file = req.file.filename;
    
            const uploaded = await upload(req, res, err => {
                if (err){
                    console.log(err)
                    res.send(500)
                }
                return true
            })

            if(uploaded){
                const data = await models.Post.create({
                    post_title: title,
                    post_body : body,
                    thumbnail_url : file,
                    author: author,
                    category_id: category_id
                })
    
                if(data){
                    return res.status(201).json({code: 0, message: 'new post successfully added', data})
                }else{
                    return res.json({code: 1, message: "new post failed added", data: null})
                }
            }
        }else{
            const data = await models.Post.create({
                post_title: title,
                post_body : body,
                thumbnail_url : "file",
                author: author,
                category_id: category_id
            })

            if(data){
                return res.status(201).json({code: 0, message: 'new post successfully added', data})
            }else{
                return res.json({code: 1, message: "new post failed added", data: null})
            }
        }
    } catch (error) {
        console.log(error)
        if(error.errors) return res.status(400).send({code: 1, message: error.errors[0].message, data: null})
        else return res.status(400).send({code: 1, message: error, data: null})
    }
}

// router.post('/addPicture', function(req, res){
//     upload(req, res, err => {
//         if (err) throw err
//         var sql = "INSERT INTO product (picture)"     
//         VALUES('"+req.file.filename+"');
//         connection.query(sql, function(err, results){
//          //script lain misal redirect atau alert :D 
//         })
//     });
// });


// Get all post
const getAllPost = async (req, res) => {
    try {
        const data = await models.Post.findAll()

        if(data.length > 0){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: "posts doesn't exist", data: null})
        }
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


// Get post by id
const getPostById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await models.Post.findOne({where : {post_id : id}})

        if(data){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 0, message: 'post with the specified ID does not exists', data: null})
        }
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


const titleImg = (title) => {
    var resTitle = ''
    title.substring(0, 19).split(' ').forEach(element => {
        resTitle += `${element}-`
    });

    console.log("title image : ", resTitle.substring(0, resTitle.length - 1))
    return resTitle.substring(0, resTitle.length - 1)
}

// Create new post
// app.post('/categories', upload.single('file'), (req,res) => {
const createPost = async (req, res) => {
    try {

        const {title, body, author, category_id} = req.body

        console.log("req.body => ", req.body)
        console.log("req.file => ", req.file)

        if(req.file){
            const tempPath = await req.file.path
            const targetPath = await path.join(__dirname, './../../public/assets/img/upload/' + titleImg(title) + ".png")
            const urlFIle = await "http://" + req.headers.host + '/static/assets/img/upload/' + titleImg(title) + '.png'
            console.log(urlFIle)

            await fs.rename(tempPath, targetPath, err => {
                if (err){
                    console.log(err);
                    return res.send(500)
                }

            })

            const data = await models.Post.create({
                post_title: title,
                post_body : body,
                thumbnail_url : urlFIle,
                author: author,
                category_id: category_id
            })

            if(data){
                return res.status(201).json({code: 0, message: 'new post successfully added', data})
            }else{
                return res.json({code: 1, message: "new post failed added", data: null})
            }
        }else{
            const data = await models.Post.create({
                post_title: title,
                post_body : body,
                author: author,
                category_id: category_id
            })

            if(data){
                return res.status(201).json({code: 0, message: 'new post successfully added', data})
            }else{
                return res.json({code: 1, message: "new post failed added", data: null})
            }
        }

    } catch (error) {
        console.log(error)
        if(error.errors) return res.status(400).send({code: 1, message: error.errors[0].message, data: null})
        else return res.status(400).send({code: 1, message: error, data: null})
    }
}


// app.post('/categories', upload.single('file'), (req,res) => {
//     const file = global.appRoot + '/uploads/' + req.file.filename;
    // fs.rename(req.file.path, file, function(err) {
//         if (err) {
//             console.log(err);
//             res.send(500);
//         } 
//         else {
//                 db.Category.create({
//                     name: req.body.name,
//                     description: req.body.description,
//                     poster : req.file.filename
//                 })
//                 .then(r =>  {
//                 res.send(r.get({plain:true}));
//                 });
//         }
//         });
// })

module.exports = { getAllPost, getPostById, createPost, createNewPost}