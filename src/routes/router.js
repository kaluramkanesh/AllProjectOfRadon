const express = require("express")
const Router = express.Router()

Router.get("/testApi", function (req, res) {
    res.status(200).send({ status: true, msg: "Api is running successfully.........." })
})
module.exports = Router