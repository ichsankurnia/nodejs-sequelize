const express = require('express')
const app = express()
const models = require('./models')

app.get('/', (res, req) => {
    res.send("Rest API using sequelize and postgres")
})

app.listen(6000, () => {
    console.log("App running on port 6000");
})