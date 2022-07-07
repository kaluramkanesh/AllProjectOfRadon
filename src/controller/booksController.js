const bookModel = require("../models/booksModel")
const reviewModel = require('../models/reviewModel')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId



exports.createBook = async function (req, res) {
    try {

        const bookData = req.body

        

        const fieldAllowed = ["title", "excerpt", "userId", "ISBN", "category", "subcategory", "releasedAt"]
        const keyOf = Object.keys(bookData);
        const receivedKey = fieldAllowed.filter((x) => !keyOf.includes(x));
        if (receivedKey.length)
        {
            return res
                .status(400)
                .send({ status: "false", msg: `${receivedKey} field is missing` });
        }

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = bookData

        const isDupliCateTitle = await bookModel.findOne({ title: title })
        if (isDupliCateTitle)
        {
            return res.status(400).send({ status: false, msg: "Title is already present" })
        }

        const isvalidUserId = await userModel.findById(userId)
        if (!isvalidUserId)
        {
            return res.status(404).send({ status: false, msg: "User not found" })
        }

        const isDupliCateISBN = await bookModel.findOne({ ISBN: ISBN })
        if (!isDupliCateISBN)
        {
            return res.status(400).send({ status: false, msg: "ISBN is already present" })
        }

        if (!(/^\d{4}-\d{2}-\d{2}$/.test(releasedAt)))
        {
            return res.status(400).send({ status: false, msg: `${releasedAt} is an invalid date, formate should be like this YYYY-MM-DD` })
        }

        const saved = await bookModel.create(bookData)
        res.status(201).send({ status: true, data: saved })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

exports.getBook = async function (req, res) {
    try {
        let filters = req.query

        Object.keys(filters).forEach(x => filters[x] = filters[x].trim())


        if (Object.keys(filters).length === 0) {

            let books = await bookModel.find({ isDeleted: false }).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1})

            if (books.length == 0) res.status(404).send({ status: false, msg: "No result found" })
            res.status(200).send({ status: true, data: books })

        }else{
            if (filters.subcategory) {
                if (filters.subcategory.includes(",")) {
                   let subcatArray = filters.subcategory.split(",").map(String).map(x => x.trim())
                    filters.subcategory = { $all: subcatArray }
                }
            }
        }
            filters.isDeleted=false;
            let filteredBooks = await bookModel.find(filters).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1})
           
            if (filteredBooks.length === 0) return res.status(404).send({ status: false, msg: "No such data available" })
            else return res.status(200).send({ status: true, data: filteredBooks })


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
