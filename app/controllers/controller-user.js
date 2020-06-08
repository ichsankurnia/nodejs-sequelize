const models = require('../../models')


// Get all data
const getAllData = async (req, res) => {
    try {
        const data = await models.User.findAll();
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
        const data = await models.User.findOne({ where: {user_id: id} })

        if (data){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: "data not found", data})
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
            return res.status(201).json({code: 0, message: 'data successfully added', data})
        }else{
            return res.json({code: 1, message: "data failed added", data})
        }

    } catch (error) {
        if(error.errors) return res.status(400).send({code: 1, message: error.errors[0].message, data: null})
        else return res.status(400).send({code: 1, message: error, data: null})
    }
}


// Update data
const updateData = async (req, res) => {
    try {
        const { id } = req.params
        const { username_var, password_var, email_var} = req.body

        const data = await models.User.findOne({ where :{user_id : id} })

        console.log(data)
        if(data){
            const update = await models.User.update({
                username_var,
                password_var,
                email_var,
                update_at: new Date()
            }, { where:{user_id: id} })

            if(update){
                const updateData = await models.User.findOne({ where : {user_id: id}})
                
                return res.json({code: 0, message: 'data successfully updated', updateData})
            }else{
                return res.json({code: 1, message: 'data failed updated', data})
            }
        }else{
            return res.json({code: 1, message: 'data not found', data})
        }
    } catch (error) {
        console.log(error)
        if(error.errors) return res.status(400).send({code: 1, message: error.errors[0].message, data: null})
        else return res.status(400).send({code: 1, message: error, data: null})
    }
}

//note export module pake {}, import module y, panggil fungsinya y.getAllData, jika tidak ada {}, panggil fungsi sama dg yg di import
module.exports = {createData, getAllData, getDataById, updateData}