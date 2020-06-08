const jwt = require('jsonwebtoken')
const models = require('../../models')

const login = async (req, res) => {
    try {
        const {username_var, password_var, remember_boo} = req.body
        const data = await models.User.findOne({where: {username_var: username_var, password_var: password_var}})

        if(data){
            
            const token = jwt.sign({ 
                user_id: data.user_id,  
                username_var: data.username_var,
                email_var: data.email_var
            }, process.env.JWT_KEY, { expiresIn: '7d' });

            // jika user memilih remember me untuk data login nya
            if (remember_boo === true) {
                // simpan dan update token ke table user
                await models.User.update({
                        token_text: token,
                        updated_at: new Date()
                    }, { where: { user_id: data.user_id }
                });
            }

            return res.status(200).json({ code: 0, message: 'success authenticate', data: {token: token} });
        }else{
            return res.status(200).json({ code: 1, message: 'wrong username or password', data: null });
        }
    } catch (error) {
        return res.status(200).send({code:1, message: error.message, data: null})
    }
}

module.exports = {login}