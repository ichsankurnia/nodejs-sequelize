const jwt = require('jsonwebtoken')
const models = require('../../models')

const login = async (req, res) => {
    try {
        const {username_var, password_var, remember_boo} = req.body
        const data = await models.User.findOne({ where: {username_var: username_var} })

        if(data){

            const dataByPass = await models.User.findOne({where: {username_var: username_var, password_var: password_var}})
            
            if(dataByPass){
                const login = await models.User.findOne({
                    where: {username_var: username_var, password_var: password_var, is_login: true},
                    attributes : ['username_var', 'password_var', 'email_var']
                })

                if(login){
                    const token = jwt.sign({ 
                        user_id: data.user_id,  
                        username_var: data.username_var,
                        email_var: data.email_var,
                        is_login: true
                    }, process.env.JWT_KEY, { expiresIn: '1d' });
        
                    // jika user memilih remember me untuk data login nya
                    if (remember_boo === true) {
                        // simpan dan update token ke table user
                        await models.User.update({
                                token_text: token,
                                updated_at: new Date()
                            }, { where: { user_id: data.user_id }
                        });
                    }
                    return res.json({ code: 0, message: 'success authenticate', data: login, token: token });
                }else{
                    return res.json({ code: 1, message: 'your account is not activate, please check your email to verify and activate account', data: null });
                }
            }else{
                return res.json({ code: 1, message: 'wrong password', data: null });
            }
        }else{
            return res.json({ code: 1, message: 'username not registered', data: null });
        }
    } catch (error) {
        return res.send({code:1, message: error.message, data: null})
    }
}

module.exports = {login}