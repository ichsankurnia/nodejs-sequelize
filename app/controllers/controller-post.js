const fs = require('fs');
const path = require('path')

const models = require('../../models')


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
                author: author,
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
        if(error.errors){
            const tempPath = await req.file.path
            fs.unlink(tempPath, err => console.log(err))

            return res.status(400).send({code: 1, message: error.errors[0].message, data: null})
        }
        else return res.status(400).send({code: 1, message: error, data: null})
    }
}


const updatePost = async (req, res) => {
    try {

        const { id } = req.params
        const {title, body, author, category_id} = req.body

        const data = await models.Post.findOne({ where : {post_id: id} })

        if(data){
            if(req.file){
                const tempPath = await req.file.path
                const targetPath = await path.join(__dirname, './../../public/assets/img/upload/' + titleImg(title) + ".png")
  
                const update = await models.Post.update({
                    post_title: title,
                    post_body : body,
                    thumbnail_url: targetPath,
                    author: author,
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
                    author: author,
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
            const tempPath = await req.file.path
            fs.unlink(tempPath, err => console.log(err))

            return res.status(400).send({code: 1, message: error.errors[0].message, data: null})
        }
        else return res.status(400).send({code: 1, message: error, data: null})
    }
}


module.exports = { getAllPost, getPostById, createPost, updatePost }