const fs = require('fs');
const path = require('path')
require('dotenv').config()

const models = require('../../models')
const domain = require('./../helper/getDomain')

// Get all post
const getAllPost = async (req, res) => {
    try {
        const data = await models.Post.findAll({
            attributes: ['post_id', 'post_title', 'post_body', 'thumbnail_url', 'createdAt', 'updatedAt'],
            include : [
                { 
                    model: models.User,
                    attributes : ['user_id', 'username_var', 'email_var'],
                    include: [
                        {
                            model : models.UserProfile, 
                            attributes : ['img_profile']
                        }
                    ]
                },
                {
                    model : models.Category,
                    attributes: ['category_id', 'category_name']
                }
            ] 
        })

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
        const data = await models.Post.findOne({
            where : { post_id : id },
            attributes: ['post_id', 'post_title', 'post_body', 'thumbnail_url', 'createdAt', 'updatedAt'],
            include : [
                { 
                    model: models.User,
                    attributes : ['user_id', 'username_var', 'email_var'],
                    include: [
                        {
                            model : models.UserProfile, 
                            attributes : ['img_profile']
                        }
                    ]
                },
                {
                    model : models.Category,
                    attributes: ['category_id', 'category_name']
                }
            ] 
        })

        if(data){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: 'post with the specified ID does not exists', data: null})
        }
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


// function untuk membuat title image dalam format nama-file.png
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

        // jika dalam request terdapat file
        if(req.file){
            console.log(req.hostname)                   // 192.168.1.8
            if(req.headers["x-forwarded-host"]){             // server
                console.log(req.get('origin'))              // undifined
                console.log(req.headers.origin)             // undifined
                console.log(req.headers['x-forwarded-proto'])   // https
                console.log(req.headers["x-forwarded-host"].split(',')[0])  // darkyasha.goes2nobel.com, darkyasha.goes2nobel.com
                console.log(req.headers["x-forwarded-for"]) // 36.69.161.207, 36.69.161.207
            }else{
                console.log(req.get('host'))                // 192.168.1.8:3006
                console.log(req.headers.host)               // 192.168.1.8:3006
            }
            console.log(req.connection.remoteAddress)   // ::ffff:192.168.1.8
            console.log(req.socket.remoteAddress)       // ::ffff:192.168.1.8

            console.log('__dirname :', __dirname)
            console.log('req.path :', req.path)

            const domainName = await domain.getFullDomainURL(req)

            const tempPath = await req.file.path                                                                       // ambil file path setelah di upload di folder tmp
            const targetPath = await path.resolve(process.env.IMG_PATH_UPLOAD) + '/' + titleImg(title) + ".png"        // ganti setiap file yg di upload menjadi .png
            const urlFile = await domainName + process.env.IMG_PATH_UPLOAD + titleImg(title) + '.png'                      // buat url untuk image tsb
            console.log(urlFile)

            const data = await models.Post.create({
                post_title: title,
                post_body : body,
                thumbnail_url : urlFile,
                // thumbnail_url : targetPath,
                user_id: author,
                category_id: category_id
            })

            if(data){
                // pindahkan file dari folder tmp ke target path (public/assets)
                await fs.rename(tempPath, targetPath, err => {
                    if (err){
                        console.log(err);
                    }
                })

                const getData = await models.Post.findOne({
                    where : {post_id: data.dataValues.post_id},
                    attributes: ['post_id', 'post_title', 'post_body', 'thumbnail_url', 'createdAt', 'updatedAt'],
                    include : [
                        { 
                            model: models.User,
                            attributes : ['user_id', 'username_var', 'email_var'],
                            include: [
                                {
                                    model : models.UserProfile, 
                                    attributes : ['img_profile']
                                }
                            ]
                        },
                        {
                            model : models.Category,
                            attributes: ['category_id', 'category_name']
                        }
                    ] 
                })

                return res.status(201).json({code: 0, message: 'new post successfully added', data: getData})
            }else{
                return res.json({code: 1, message: "new post failed added", data: null})
            }
        }else{
            const data = await models.Post.create({
                post_title: title,
                post_body : body,
                user_id: author,
                category_id: category_id
            })

            if(data){
                const getData = await models.Post.findOne({
                    where : {post_id: data.dataValues.post_id},
                    attributes: ['post_id', 'post_title', 'post_body', 'thumbnail_url', 'createdAt', 'updatedAt'],
                    include : [
                        { 
                            model: models.User,
                            attributes : ['user_id', 'username_var', 'email_var'],
                            include: [
                                {
                                    model : models.UserProfile, 
                                    attributes : ['img_profile']
                                }
                            ]
                        },
                        {
                            model : models.Category,
                            attributes: ['category_id', 'category_name']
                        }
                    ] 
                })

                return res.status(201).json({code: 0, message: 'new post successfully added, no file uploaded', data: getData})
            }else{
                return res.json({code: 1, message: "new post failed added", data: null})
            }
        }

    } catch (error) {
        console.log(error)

        if(req.file){
            const tempPath = await req.file.path
            fs.unlink(tempPath, err => console.log(err))
        }

        if(error.errors){
            return res.json({code: 1, message: error.errors[0].message, data: null})
        }
        else return res.json({code: 1, message: error, data: null})
    }
}


// Update post
const updatePost = async (req, res) => {
    try {

        const { id } = req.params
        const {title, body, author, category_id} = req.body

        const data = await models.Post.findOne({ where : {post_id: id} })

        if(data){
            if(req.file){
                const domainName = await domain.getFullDomainURL(req)

                const tempPath = await req.file.path                                                                        // ambil file path setelah di upload di folder tmp
                const targetPath = await path.resolve(process.env.IMG_PATH_UPLOAD) + '/' + titleImg(title) + ".png"         // ganti setiap file yg di upload menjadi .png
                const urlFile = await domainName + process.env.IMG_PATH_UPLOAD + titleImg(title) + '.png'                       // buat url untuk image tsb
  
                const update = await models.Post.update({
                    post_title: title,
                    post_body : body,
                    // thumbnail_url: targetPath,
                    thumbnail_url: urlFile,
                    user_id: author,
                    category_id: category_id,
                    update_at: new Date()
                }, {where : {post_id: id} })
    
                // jika data success di update
                if(update){
                    const updateData = await models.Post.findOne({
                        where: {post_id: id}, 
                        attributes: ['post_id', 'post_title', 'post_body', 'thumbnail_url', 'createdAt', 'updatedAt'],
                        include : [
                            { 
                                model: models.User,
                                attributes : ['user_id', 'username_var', 'email_var'],
                                include: [
                                    {
                                        model : models.UserProfile, 
                                        attributes : ['img_profile']
                                    }
                                ]
                            },
                            {
                                model : models.Category,
                                attributes: ['category_id', 'category_name']
                            }
                        ] 
                    })
                    
                    // delete image yg lama, dengan mengambil path yg lama pada column thumbnail_url
                    if(data.dataValues.thumbnail_url !== null){
                        const imgName = path.basename(data.dataValues.thumbnail_url, '.png')                            // get filename yg berformat .png
                        const imgPath = path.resolve(process.env.IMG_PATH_UPLOAD) + '/' + imgName + '.png'              // get full file path

                        await fs.unlink(imgPath, err => {
                            if(err){
                                console.log(err)
                            }
                        })
                    }

                    // update dg image yg baru
                    await fs.rename(tempPath, targetPath, err => {
                        if (err){
                            console.log(err);
                        }
                    })

                    return res.status(201).json({code: 0, message: 'post successfully updated', data: updateData})
                }else{
                    return res.json({code: 1, message: "post failed updated", data: null})
                }
            }else{
                const update = await models.Post.update({
                    post_title: title,
                    post_body : body,
                    user_id: author,
                    category_id: category_id,
                    update_at: new Date()
                }, {where : {post_id: id} })
    
                if(update){
                    const updateData = await models.Post.findOne({
                        where: {post_id: id},
                        attributes: ['post_id', 'post_title', 'post_body', 'thumbnail_url', 'createdAt', 'updatedAt'],
                        include : [
                            { 
                                model: models.User,
                                attributes : ['user_id', 'username_var', 'email_var'],
                                include: [
                                    {
                                        model : models.UserProfile, 
                                        attributes : ['img_profile']
                                    }
                                ]
                            },
                            {
                                model : models.Category,
                                attributes: ['category_id', 'category_name']
                            }
                        ] 
                    })

                    return res.status(201).json({code: 0, message: 'post successfully updated, no files updated', data: updateData})
                }else{
                    return res.json({code: 1, message: "post failed updated", data: null})
                }
            }
        }else{
            return res.json({code: 1, message: "post's with the specified ID does not exists", data: null})
        }

    } catch (error) {
        console.log(error)

        if(req.file){
            const tempPath = await req.file.path
            fs.unlink(tempPath, err => console.log(err))
        }

        if(error.errors){
            return res.json({code: 1, message: error.errors[0].message, data: null})
        }
        else return res.json({code: 1, message: error, data: null})
    }
}


// Delete post
const deletePost = async (req, res) => {
    try {
        
        const { id } = req.params

        const data = await models.Post.findOne({ where: {post_id: id} })

        if(data){
            const deleteData = await models.Post.destroy({ where: { post_id: id} })
    
            if(deleteData){
                if(data.dataValues.thumbnail_url !== null){
                    const imgName = path.basename(data.dataValues.thumbnail_url, '.png')                            // get filename yg berformat .png
                    const imgPath = path.resolve(process.env.IMG_PATH_UPLOAD) + '/' + imgName + '.png'              // get full file path

                    fs.unlink(imgPath, err => {
                        if(err){
                            console.log(err)
                        }
                    })
                }

                return res.json({code: 0, message: 'data successfully deleted', data: data})
            }else{
                return res.json({code: 1, message: 'data failed deleted', data: null})
            }
        }else{
            return res.json({code: 1, message: "post's with the specified ID does not exists", data: null})
        }

    } catch (error) {
        if(error.message) return res.send({code: 1, message: error.message, data: null})
        else return res.send({code: 1, message: error, data: null})
    }
}


module.exports = { getAllPost, getPostById, createPost, updatePost, deletePost }