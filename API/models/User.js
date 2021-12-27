const mongoose = require("mongoose")

const UserChema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        // createAt: Date.now(),
        // updateAt: Date.now()
    },
    { timestamps: true }
)

module.exports = mongoose.model("User", UserChema)