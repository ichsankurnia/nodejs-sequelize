const models = require('../../models')

const getAllCategories = async (req, res) => {
    try {
        const data = await models.Category.findAll()

        if(data.lenght > 0){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: 'failed', data})
        }
    } catch (error) {
        if(error.message) return res.json({code: 1, message: error.message, data: null})
        else return res.json({code: 1, message: error, data: null})
    }
}


const getCategoryById = async (req, res) => {
    try {

        const { id } = req.params
        const data = await models.Category.findOne({ where : {category_id: id} })

        if(data){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: "category with the specified ID doesn't exist", data})
        }
    } catch (error) {
        if(error.message) return res.json({code: 1, message: error.message, data: null})
        else return res.json({code: 1, message: error, data: null})
    }
}


const createCategory = async (req, res) => {
    try {
        const data = await models.Category.create(req.body)

        if(data) return res.json({code: 0, message: 'new category successfully added', data})
        else return res.json({code: 1, message: 'new categroy failed added', data: null})

    } catch (error) {
        console.log(error)
        if(error.errors) return res.json({code: 1, message: error.errors[0].message, data: null})
        else return res.json({code: 1, message: error, data: null})
    }
}


const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { category_name } = req.body

        const data = await models.Category.findOne({ where : {category_id: id} })

        if(data){
            const update = await models.Category.update({
                category_name: category_name,
                update_at: new Date()
            }, { where : {category_id: id} })

            if(update){
                const updateData = await models.Category.findOne({ where : {category_id: id} })
                return res.json({code: 0, message: 'category successfully updated', data: updateData})
            }else{
                return res.json({code: 1, message: 'categroy failed updated', data: null})
            }
        }else{
            return res.json({code: 1, message: "category with the specified ID doesn't exist", data: null})
        }
    } catch (error) {
        console.log(error)
        if(error.errors) return res.json({code: 1, message: error.errors[0].message, data: null})
        else return res.json({code: 1, message: error, data: null})
    }
}


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const data = await models.Category.findOne({ where: {category_id: id} })
        
        if(data){
            const deleteData = await models.Category.destroy({ where: {category_id: id}} )
            
            if(deleteData) return res.json({code: 0, message: "category successfully deleted", data: deleteData})
            else return res.json({code: 1, message: "category failed deleted", data: null})
        }else{
            return res.json({code: 1, message: "category with the specified ID doesn't exist", data: null})
        }
    } catch (error) {
        if(error.message) return res.json({code: 1, message: error.message, data: null})
        else return res.json({code: 1, message: error, data: null})
    }
}


const truncateCategories = async (req, res) => {
    try {
        await models.User.destroy({truncate: true, restartIdentity: true})
        
        return res.json({code: 0, message: 'all categories successfully truncates', data: null})
    } catch (error) {
        if(error.message) return res.json({code: 1, message: error.message, data: null})
        else return res.json({code: 1, message: error, data: null})
    }
}


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    truncateCategories
}