const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')

// Register
router.post("/register", async (req, res) => {
    const newUser = new User({

        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
    })

    try {
        const saveUser = await newUser.save()
        console.log(saveUser)
        res.status(201).json(saveUser)

    } catch (err) {
        console.log("err")
        res.status(500).json(err)
    }

})

// Login
router.post("/login", async (req, res) => {
    console.log(req.body.username)
    try {
        const user = await User.findOne({ username: req.body.username })

        !user && res.status(401).json("Wrong credentials")


        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET)
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8)

        Originalpassword !== req.body.password && res.status(401).json("wrong credentials!")

        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin, }, process.env.JWT_SECRET, { expiresIn: "3d" })
        console.log(accessToken)
        const { password, ...others } = user._doc
        res.status(200).json({ ...others, accessToken })
    } catch (err) {
        res.status(400).json("lỗi" + err)

    }

})


module.exports = router