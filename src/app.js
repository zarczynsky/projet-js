/*const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello, Mr. World!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

app.get('/rzodkiew', (req,res) => {
    res.send('Something called rzodkiew has been requested. Sadly, there is no rzodkiew here.') // TODO: Make it a 404
})

app.get('/buraki', (req,res) => {
    res.send('Something called buraki has been requested. Sadly, there is no buraki here.') // TODO: Make it a 404
})*/

const express = require('express');
const api = require('./api')
//const errorHandler = require("./src/middlewares/errorHandler");
const mongoose = require('mongoose')

const port = process.env.PORT || 9000;
const env = process.env.NODE_ENV || 'development';
const app = express();
mongoose.connect('mongodb://localhost/przepisy', {debug: true, useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.once('open', () => {
    console.log('Databse connected');
})

mongoose.connection.on('error', () => {
    console.error('Database error');
})

app.use(express.json());
app.use('/api', api)

//app.use(errorHandler);

app.listen(port, '127.0.0.1', () => {
    console.log(`Server listening on http://127.0.0.1:${port} in ${env} mode`);
})