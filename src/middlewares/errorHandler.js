const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(
        {
            message: err.message || 'Error occurred'
        }
    )
}

module.exports = errorHandler;