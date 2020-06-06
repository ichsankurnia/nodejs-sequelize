const express = require('express')
const host = require("ip").address();
require('dotenv').config()

const models = require('./models')
const app = express()

const port = process.env.PORT

models.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("App listening at http://%s:%s", host, port);
    })
})

app.get('/', (req, res) => {
    res.send("Rest API using sequelize and postgres")
})