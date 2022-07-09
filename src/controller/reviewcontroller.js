const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


exports.createReview = async function (req, res) {
    try {
        const { reviewedBy, review, rating } = req.body
        let bookId = req.params.bookId.trim()
        let findBook = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, msg: 'your searched book is not exist' })
        let details = {}
        details.bookId = bookId.trim()
        details.reviewedBy = reviewedBy.trim()
        details.review = review.trim()
        details.rating = rating

        let setReview = await reviewModel.create(details)
        let updateBook = await booksModel.findOneAndUpdate({_id:bookId},{$inc:{reviews :1}},{new:true})
        let mixed = {...updateBook.toJSON(),reviewsData: setReview}
        res.status(201).send({ status: true, message: "Success", data: mixed})

    } catch (err) {
        res.status(500).send(err.message)
    }
}

exports.deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if(!ObjectId.isValid(bookId)||!ObjectId.isValid(reviewId)) return res.status(400).send({status:false,msg:'please put a valid ObjectId'})
        let findBook = await booksModel.findOne({ _id: bookId })
        if (!findBook) return res.status(404).send({ status: false, msg: "no such book exist🤷‍♂️🤷‍♂️" })
        let findreview = await reviewModel.findOneAndUpdate({ bookId: bookId, _id: reviewId }, { $set: { isDeleted: true } }, { new: true })
        if (!findreview) return res.status(404).send({ status: false, msg: 'no such review exist' })
        let updateBook = await booksModel.findOneAndUpdate({_id:bookId},{$inc:{reviews : -1}},{new:true})
        res.status(200).send()


    } catch (err) {
        res.status(500).send(err.message)
    }
}