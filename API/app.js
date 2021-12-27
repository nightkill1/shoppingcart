
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3001
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const bodyParser = require('body-parser')
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

bodyParser.urlencoded([])
dotenv.config()

mongoose.connect(process.env.ACCESS_DB)
    .then(() => console.log("database is connected"))
    .catch((e) => { console.log(e) })

app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/product', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/order', orderRoute)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
