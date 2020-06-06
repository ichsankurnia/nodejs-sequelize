const express = require('express')
const app = express()
const models = require('./models')
const host = require("ip").address();
const port = 8080

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
})

app.get('/', (req, res) => {
    res.send("Rest API using sequelize and postgres")
})