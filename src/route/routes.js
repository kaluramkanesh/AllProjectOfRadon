const express = require("express")
const userController = require("../controller/userController")
const router = express.Router()
const bookController = require("../controller/booksController") 

router.get("/test", function (req, res) {
    res.send("Test api ")
})
router.post("/register", userController.createUser)
router.post('/login', userController.loginUser)
router.post("/books", bookController.createBook)


module.exports = router