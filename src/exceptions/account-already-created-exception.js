class AccountAlreadyCreatedException extends Error {
    constructor(message) {
        super(message || "Konto juz istnieje");
        this.status = 409
    }
}

module.exports = AccountAlreadyCreatedException;