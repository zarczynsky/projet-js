class EmailTakenException extends Error {
    constructor(message) {
        super(message || "Email already registered");
        this.status = 409
    }
}

module.exports = EmailTakenException;