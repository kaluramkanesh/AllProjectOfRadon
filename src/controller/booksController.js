const bookModel = require("../models/booksModel")
const reviewModel = require('../models/reviewModel')



exports.createBook = async function (req, res) {
    try {

        const book = req.body

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = book

        const saved = await bookModel.create(book)
        res.status(201).send({ status: true, data: saved })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

exports.getBook = async function (req, res) {
    try {
        const bookData = await bookModel.find({ isDeleted: false })
        if (bookData.length == 0) { res.status(404).send({ status: false, msg: "No books found " }) }
        return res.status(200).send({ status: true, message: 'Success', data: bookData })

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

exports.getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if(!(ObjectId.isValid(bookId)) || !bookId) return res.status(400).send({status:false,msg:'Enter a valid ObjectId'})
        let findBook = await bookModel.findOne({ _id: bookId }).select({deletedAt:0})
        if (!findBook) return res.status(404).send({ status: false, msg: "no data found" })
        let findReview = await reviewModel.find({ bookId: bookId })

        let result = { ...findBook.toJSON(), reviewsData: findReview }

        res.status(200).send({ status: true, message: "Book-list", data: result })


    } catch (err) {
        res.status(500).send(err.message)
    }
}
