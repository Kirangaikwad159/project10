const express = require('express');
const {sequelize, connectDB} = require('./config/connectDB');
const userRoute = require('./route/userRoute');
const app = express();
const logger = require("./winston");
const dotenv = require('dotenv');
dotenv.config();

const port = 5000
app.use(express.json())

const start = async()=>{
    try {
        await connectDB()
        await sequelize.sync({alert:true})
        logger.info('Database synced successfully');
    } catch (error) {
        logger.error(`Database connection error: ${error.message}`);
        console.error(error)
    }
}

app.use('/api/user', userRoute);

app.listen(port, ()=>{
    console.log('App is listening on 5000')
});
start();