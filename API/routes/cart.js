const router = require("express").Router()
const Product = require("../models/Product")
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorrization } = require('./verifyToken')

// create
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const saveCart = await newCart.save()
        res.status(200).json(saveCart)
    } catch (err) {
        res.status(500).json(err)
    }

})


// UPDATE 
router.put("/:id", verifyTokenAndAuthorrization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            }, { new: true })
        res.status(202).json(updatedCart)
    } catch (err) {
        res.status(403).send("Password is not defind")
    }
})

// DELETE Card
router.delete("/:id", verifyTokenAndAuthorrization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been Deleted...")
    } catch (err) {
        res.status(403).send("Pá")
    }
})

// GET user Card
router.get("/find/userId", verifyTokenAndAuthorrization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
        res.status(200).json({ cart })
    } catch (err) {
        res.status(403).send(err)
    }
})

// GET ALL 
router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const carts = await Cart.find()

        res.status(200).json(carts)
    } catch (err) {
        res.status(500).send(err)
    }
})


module.exports = router