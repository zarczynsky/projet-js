const NotFoundException = require('../exceptions/not-found-exception')
const undefinedEndpointHandler = (req, res) => {
    res.status(404).send('<body style="background-color:black; padding: 30px; color: white"><center><h2><u>404 Error</u></h2><h1>I have no idea where this will lead us. But I have a definite feeling it will be a place both wonderful and strange.</h1>- Agent Dale Cooper.</center></body>')
    throw new NotFoundException()
}

module.exports = undefinedEndpointHandler