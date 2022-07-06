const express = require("express")
const userController = require("../controller/userController")
const router = express.Router()

router.get("/test", function (req, res) {
    res.send("Test api ")
})
router.post("/register", userController.createUser)
router.post('/login', userController.loginUser)

module.exports = router