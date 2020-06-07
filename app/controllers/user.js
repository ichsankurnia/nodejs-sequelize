const models = require('../../database/models')

//Get all data
const getAllData = async (req, res) => {
    try {
        const data = await models.User.findAll();
        if(data.length){
            return res.status(200).json({code: 0, message: 'success', data})
        }else{
            return res.status(200).json({code: 1, message: "data doesn't exist", data})
        }
    } catch (error) {
        return res.status(200).send({code: 1, message: error.message, data: null})
    }
}

module.exports = {getAllData}