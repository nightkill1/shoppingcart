const router = require("express").Router()
const Product = require("../models/Product")
const { verifyToken, verifyTokenAndAdmin } = require('./verifyToken')

// create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const saveProduct = await newProduct.save()
        res.status(200).json(saveProduct)
    } catch (err) {
        res.status(500).json(err)
    }

})


router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true })
        res.status(202).json(updatedProduct)
    } catch (err) {
        res.status(403).send("Password is not defind")
    }
})

// DELETE user
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been Deleted...")
    } catch (err) {
        res.status(403).send("Pá")
    }
})

// GET product
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json({ product })
    } catch (err) {
        res.status(403).send(err)
    }
})

// GET ALL product
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createAt: -1 }).limit(1)

        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],

                }
            })
        } else {
            products = await Product.find()
        }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).send(err)
    }
})


module.exports = router