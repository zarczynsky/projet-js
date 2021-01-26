const express = require('express');
const app = express();
const api = require('./api')
const asyncHandler = require('./api/async-handler')
const errorHandler = require("./middlewares/errorHandler");
const mongoose = require('mongoose')
const undefinedEndpointHandler = require('./middlewares/undefinedEndpointHandler');
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
mongoose.connect('mongodb://localhostt:27017/test2', {debug: true, useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.once('open', () => {
    console.log('Databse connected');
})

mongoose.connection.on('error', () => {
    console.error('Database error');
})

app.use(express.json());
app.use('/api', api)
app.use(errorHandler);
app.listen(port, '127.0.0.1', () => {
    console.log(`Server listening on http://127.0.0.1:${port} in ${env} mode`);
})

app.get('/rzodkiew', asyncHandler(async (req, res) => {
    res.send(`
    <center>It's-a-me, rzodkiewko!<br/><img src="https://www.rynek-rolny.pl/images/articles/560/67c46c78378b9f058d70895ce23a6158-carmesa.jpg"/></center>`) // TODO: Make it a 404
}))

app.get('/burak', asyncHandler(async (req, res) => {
    res.send('<center>Something called buraki has been requested. Sadly, there is no buraki here.<br/>Here\'s a burak for you:<br/><img src="https://i.pinimg.com/originals/aa/7a/54/aa7a54f2db2336748cd4bb46c4013fd0.jpg"></center>')
}))

app.use('*', undefinedEndpointHandler)