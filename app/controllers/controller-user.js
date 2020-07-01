const models = require('../../models')
const mail = require('./../helper/sendEmail')

// Get all data
const getAllData = async (req, res) => {
    try {
        const data = await models.User.findAll({
            include: [ 
                { model: models.UserProfile },
            ]
        });
        if(data.length){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: "data doesn't exist", data})
        }
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


// Get single data by id
const getDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await models.User.findOne({ 
            where: {user_id: id},
            include: [ 
                { model: models.UserProfile }
            ] 
        })

        if (data){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: "data with the specified ID does not exists", data})
        }
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


// Create new user
const createData = async (req, res) => {
    try {
        const data = await models.User.create(req.body)
        
        if(data){
            // await mail.sendMailRegister(req.body)
            mail.sendMailRegister2(req.body)

            return res.status(201).json({code: 0, message: 'data successfully registered, please check your email now!', data})
        }else{
            return res.json({code: 1, message: "data failed added", data: null})
        }

    } catch (error) {
        if(error.errors) return res.send({code: 1, message: error.errors[0].message, data: null})
        else return res.send({code: 1, message: error, data: null})
    }
}


// Update data
const updateData = async (req, res) => {
    try {
        const { id } = req.params
        const { username_var, password_var, email_var} = req.body

        const data = await models.User.findOne({ where :{user_id : id} })

        // console.log(data)
        if(data){
            const update = await models.User.update({
                username_var,
                password_var,
                email_var,
                update_at: new Date()
            }, { where:{user_id: id} })

            if(update){
                const updateData = await models.User.findOne({ where : {user_id: id}})

                return res.json({code: 0, message: 'data successfully updated', data: updateData})
            }else{
                return res.json({code: 1, message: 'data failed updated', data: null})
            }
        }else{
            return res.json({code: 1, message: 'data with the specified ID does not exists', data})
        }
    } catch (error) {
        // console.log(error)
        if(error.errors) return res.json({code: 1, message: error.errors[0].message, data: null})
        else return res.json({code: 1, message: error, data: null})
    }
}



// Delete data
const deleteData = async (req, res) => {
    try {
        const { id } = req.params

        const data = await models.User.findOne({ where: {user_id: id} })

        if(data){
            const deleteData = await models.User.destroy({ where: { user_id: id} })
    
            if(deleteData){
                return res.json({code: 0, message: 'data successfully deleted', data: deleteData})
            }else{
                return res.json({code: 1, message: 'data failed deleted', data: null})
            }
        }else{
            return res.json({code: 1, message: 'data with the specified ID does not exists', data: null})
        }

    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


// Truncate data
const truncateData = async (req, res) => {
    try {
        await models.User.destroy({truncate: true, restartIdentity: true})
        
        return res.json({code: 0, message: 'data successfully truncate', data: null})
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


//note export module pake {}, import module y, panggil fungsinya y.getAllData, jika tidak ada {}, panggil fungsi sama dg yg di import
module.exports = {
    getAllData, 
    getDataById, 
    createData, 
    updateData, 
    deleteData,
    truncateData,
}