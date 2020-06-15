const express = require('express')
const bodyParser    = require('body-parser'); // turns response into usable format
const cors = require('cors')
const path = require('path')
const host = require("ip").address();
require('dotenv').config()

const app = express()
const port = process.env.PORT

const models = require('./models')
const route = require('./routes/route')

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', (req, res) => {
    res.send({ author: 'Ichsan Kurniawan', contact: 'kurniaichsan45@gmail.com', description: 'Rest API with nodejs express sequelize postgre' })
})
// route for static file (html css js img)
app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use('/public', express.static(path.join(__dirname, 'public')))

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