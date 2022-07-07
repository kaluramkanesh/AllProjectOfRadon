const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const bookController = require("../controller/booksController")
const reviewController = require("../controller/reviewcontroller")
const validator  = require("../validator/validation")

router.get("/test", function (req, res) {
    res.send("Test api ")
})
router.post("/register",validator.userValidation, userController.createUser)
router.post('/login', userController.loginUser)
router.post("/books", bookController.createBook)
router.get("/books/:bookId",bookController.getBookById)




/*********************Review API**********************/
router.post("/books/:bookId/review", validator.reviewValidation, reviewController.createReview)


module.exports = router