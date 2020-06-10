const express = require('express')
const bodyParser    = require('body-parser'); // turns response into usable format
const host = require("ip").address();
require('dotenv').config()

const app = express()
const port = process.env.PORT

const models = require('./models')
const route = require('./routes/route')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', (req, res) => {
    res.status(200).json({ author: 'Ichsan Kurniawan', contact: 'kurniaichsan45@gmail.com', description: 'Rest API with nodejs express sequelize postgre' })
})

// Route API
app.use('/api/', route)


//alter true change the database structure and data, run the sync func, and data is kept untouched
//force data will lost
models.sequelize.sync({alter:true}).then(() => {
    app.listen(port, () => {
        console.log("App listening at http://%s:%s", host, port);
    })
}).catch((err) => {
    console.log('Unable to connect to the database: ', err);
})