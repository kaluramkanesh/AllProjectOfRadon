const express = require("express")
const Router = express.Router()
const Controller=require("../controller/urlController")
Router.get("/testApi", function (req, res) {
    res.status(200).send({ status: true, msg: "Api is running successfully.........." })
})
Router.post("/url/shorten",Controller.createUrlShortner)

Router.get("/:urlCode",Controller.GetUrlByurlCode)

Router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports = Router