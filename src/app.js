const express = require('express')
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
    res.send('Something called buraki has been requested. Sadly, there is no buraki here.')
})// TODO: Make it a 404