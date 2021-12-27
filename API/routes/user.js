const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorrization } = require('./verifyToken')

router.put("/:id", verifyTokenAndAuthorrization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET
        ).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true })
        res.status(202).json(updatedUser)
    } catch (err) {
        res.status(403).send("Password is not defind")
    }
})

// DELETE user
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been Deleted...")
    } catch (err) {
        res.status(403).send("Pá")
    }
})

// GET user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json({ ...others })
    } catch (err) {
        res.status(403).send(err)
    }
})

// GET ALL user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const user = query ? await User.find().sort({ _id: -1 }).limit(1) : await User.find()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

// GET user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1))
    console.log(lastyear)

    try {

        const data = await User.aggregate([
            {
                $match: { createdAt: { $gte: lastyear } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ])
        console.log(data)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router