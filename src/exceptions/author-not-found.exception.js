class AuthorNotFoundException extends Error {
    constructor(message) {
        super(message || "Author not found");
        this.status = 404
    }
}

module.exports = AuthorNotFoundException;