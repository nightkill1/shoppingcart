const router = require("express").Router()
const Order = require("../models/Order")
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorrization } = require('./verifyToken')

// create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const saveOrder = await newOrder.save()
        res.status(200).json(saveOrder)
    } catch (err) {
        res.status(500).json(err)
    }

})


// UPDATE 
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            }, { new: true })
        res.status(202).json(updatedOrder)
    } catch (err) {
        res.status(403).send("Password is not defind")
    }
})

// DELETE Card
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been Deleted...")
    } catch (err) {
        res.status(403).send("Pá")
    }
})

// GET user Card
router.get("/find/userId", verifyTokenAndAuthorrization, async (req, res) => {
    try {
        const cart = await Order.find({ userId: req.params.userId })
        res.status(200).json({ cart })
    } catch (err) {
        res.status(403).send(err)
    }
})

// GET ALL 
router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const carts = await Order.find()

        res.status(200).json(carts)
    } catch (err) {
        res.status(500).send(err)
    }
})

// GET MONTHLY INCOME

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lasstMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lasstMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                },
            },


        ])
        res.status(200).json(income)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router