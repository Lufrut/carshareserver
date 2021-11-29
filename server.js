require('dotenv').config()
const schedule = require("node-schedule");
const sequelize = require('./db');
const express =require('express');
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/mainRouter')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const fileUpload = require('express-fileupload')

const PORT = process.env.PORT || 5000;
const  app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,() => console.log(`Server started on port ${PORT} `))
    } catch (e){
        console.log(e)
    }
}
start()