class DishNotFoundException extends Error {
    constructor(message) {
        super(message || "Dish not found");
        this.status = 404
    }
}

module.exports = DishNotFoundException;