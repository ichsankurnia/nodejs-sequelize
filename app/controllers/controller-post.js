const fs = require('fs');
const path = require('path')

const models = require('../../models')


// Get all post
const getAllPost = async (req, res) => {
    try {
        const data = await models.Post.findAll({
            include: [ 
                {
                    model: models.User, include: models.UserProfile
                },
                {
                    model: models.Category
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
            include: [ 
                {model: models.User, include: models.UserProfile },
                {model: models.Category} 
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

        if(req.file){
            const tempPath = await req.file.path
            const targetPath = await path.join(__dirname, './../../public/assets/img/upload/' + titleImg(title) + ".png")
            const urlFIle = await "http://" + req.headers.host + '/static/assets/img/upload/' + titleImg(title) + '.png'
            console.log(urlFIle)

            const data = await models.Post.create({
                post_title: title,
                post_body : body,
                // thumbnail_url : urlFIle,
                thumbnail_url : targetPath,
                user_id: author,
                category_id: category_id
            })

            if(data){
                await fs.rename(tempPath, targetPath, err => {
                    if (err){
                        console.log(err);
                        return res.send(500)
                    }
                })

                return res.status(201).json({code: 0, message: 'new post successfully added', data})
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
                return res.status(201).json({code: 0, message: 'new post successfully added, no file uploaded', data})
            }else{
                return res.json({code: 1, message: "new post failed added", data: null})
            }
        }

    } catch (error) {
        console.log(error)
        if(error.errors){
            if(req.file){
                const tempPath = await req.file.path
                fs.unlink(tempPath, err => console.log(err))
            }

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
                const tempPath = await req.file.path
                const targetPath = await path.join(__dirname, './../../public/assets/img/upload/' + titleImg(title) + ".png")

                // delete image yg lama
                await fs.unlink(data.dataValues.thumbnail_url, err => {
                    if(err){
                        console.log(err)
                    }
                })
  
                const update = await models.Post.update({
                    post_title: title,
                    post_body : body,
                    thumbnail_url: targetPath,
                    user_id: author,
                    category_id: category_id,
                    update_at: new Date()
                }, {where : {post_id: id} })
    
                if(update){
                    await fs.rename(tempPath, targetPath, err => {
                        if (err){
                            console.log(err);
                            return res.send(500)
                        }
                    })

                    const updateData = await models.Post.findOne({where: {post_id: id} })

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
                    const updateData = await models.Post.findOne({where: {post_id: id} })

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
        if(error.errors){
            if(req.file){
                const tempPath = await req.file.path
                fs.unlink(tempPath, err => console.log(err))
            }

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
                const imgPath = data.dataValues.thumbnail_url

                fs.unlink(imgPath, err => {
                    if(err){
                        console.log(err)
                        res.sendStatus(500)
                    }
                })

                return res.json({code: 0, message: 'data successfully deleted', data: deleteData})
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