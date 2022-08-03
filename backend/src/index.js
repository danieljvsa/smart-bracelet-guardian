const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const app = express()

require('dotenv').config()




app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes)







app.listen( process.env.PORT || 3333,() => {
    console.log('Listenning to requests on port 3333')
})