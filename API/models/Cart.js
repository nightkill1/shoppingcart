const mongoose = require("mongoose")

const CartChema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: {
                    type: String,

                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            }
        ]
    },
    { timesamps: true }
)

module.exports = mongoose.model("Cart", CartChema)