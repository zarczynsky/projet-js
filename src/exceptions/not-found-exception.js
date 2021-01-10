class NotFoundException extends Error {
    constructor(message) {
        super(message || "Resource not found error");
        this.status = 404
    }
}

module.exports = NotFoundException;