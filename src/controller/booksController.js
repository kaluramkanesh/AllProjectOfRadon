const bookModel = require("../models/booksModel")
const reviewModel = require('../models/reviewModel')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId


const isvalid = function (value) {
    if (typeof value === undefined || typeof value === null) return false
    if (typeof value !== String || value.trim().length == 0) return false
    return true
}
const isValidKey = function (value) {
    if (!value) return false
    return true
}
exports.createBook = async function (req, res) {
    try
    {
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
        /**********************************Start's title validation********************************/
        if (isValidKey(title)) return res.status(400).send({ status: false, msg: "title field is required" })

        if (!isvalid(title)) return res.status(400).send({ status: false, msg: `${title} is not valid title` })

        if (!/^[a-zA-Z 0-9 ,-_'@$&]$/) return res.status(400).send({ status: false, msg: `${title} is not valid title` })

        const isDupliCateTitle = await bookModel.findOne({ title: title })

        if (isDupliCateTitle) { return res.status(400).send({ status: false, msg: "title is already present in our DataBase" }) }
        /**********************************End title validation********************************/

        /**********************************start's userID validation********************************/
        if (isValidKey(userId)) return res.status(400).send({ status: false, msg: "userID field is required" })

        if (!isvalid(userId)) return res.status(400).send({ status: false, msg: `${userId} enter valid userID` })

        let isValidUserID = mongoose.Types.ObjectId.isValid(userId)
        console.log(isValidUserID)
        if (!isValidUserID) return res.status(400).send({ status: false, msg: `${userId} userID has something wrong` })

        const isvalidUserId = await userModel.findById(userId)

        if (!isvalidUserId) { return res.status(404).send({ status: false, msg: "User not found" }) }

        /**********************************End userID validation********************************/

        /**********************************Start's ISBN validation********************************/
        if (!isValidKey(ISBN)) return res.status(400).send({ status: false, msg: "ISBN field is required" })

        if (!isvalid(ISBN)) return res.status(400).send({ status: false, msg: `${ISBN} Is not valid ` })

        const isDupliCateISBN = await bookModel.findOne({ ISBN: ISBN })
        if (isDupliCateISBN)
        {
            return res.status(400).send({ status: false, msg: "ISBN is already present in our DataBase" })
        }
        /**********************************End ISBN validation********************************/

        /********************************** Start's RealeasedAt validation********************************/
        if (isValidKey(releasedAt)) return res.status(400).send({ status: false, msg: "realeasedAt field is required" })

        if (!isvalid(releasedAt)) return res.status(400).send({ status: false, msg: `${releasedAt} is not valid date, date formate should be like YYYY-MM-DD` })

        // /^\d{4}-\d{2}-\d{2}$/
        if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(releasedAt))
        {
            return res.status(400).send({ status: false, msg: `${releasedAt} is an invalid date, formate should be like this YYYY-MM-DD` })
        }
        /**********************************End RealeasedAt validation********************************/

        /********************************** Start's Category validation********************************/

        if (isValidKey(category)) return res.status(400).send({ status: false, msg: "category field is required" })

        if (!isvalid(category)) return res.status(400).send({ status: false, msg: `${category} is not valid category` })

        if (!/^[a-zA-Z .,'-_]$/.test(category)) res.status(400).send({ status: false, msg: `${category} is not valid category ` })

        /**********************************End Category validation********************************/

        /**********************************Start's Subcategory validation********************************/

        if (isValidKey(subcategory)) return res.status(400).send({ status: false, msg: "subcategory field is required" })

        if (!isvalid(subcategory)) return res.status(400).send({ status: false, msg: `${subcategory} is not valid subcategory` })

        if (!/^[a-zA-Z .',-_]$/.test(subcategory)) return res.status(400).send({ status: false, msg: `${subcategory} is not valid subcategory please enter valid subcategory` })

        /**********************************End Subcategory validation********************************/

        const saved = await bookModel.create(bookData)
        res.status(201).send({ status: true, data: saved })
    }
    catch (err)
    {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

exports.getBook = async function (req, res) {
    try
    {
        let filters = req.query

        Object.keys(filters).forEach(x => filters[x] = filters[x].trim())
        if (filters.userId != 24) { res.status(400).send(" UserId Invalid ") }

        if (Object.keys(filters).length === 0)
        {

            let books = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

            if (books.length == 0) res.status(404).send({ status: false, msg: "No result found" })
            res.status(200).send({ status: true, data: books })

        } else
        {
            if (filters.subcategory)
            {
                if (filters.subcategory.includes(","))
                {
                    let subcatArray = filters.subcategory.split(",").map(String).map(x => x.trim())
                    filters.subcategory = { $all: subcatArray }
                }
            }
        }
        filters.isDeleted = false;
        let filteredBooks = await bookModel.find(filters).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        if (filteredBooks.length === 0) return res.status(404).send({ status: false, msg: "No such data available" })
        else return res.status(200).send({ status: true, data: filteredBooks })


    }
    catch (err)
    {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

exports.getBookById = async function (req, res) {
    try
    {
        let bookId = req.params.bookId
        if (!(ObjectId.isValid(bookId))) return res.status(400).send({ status: false, msg: 'Enter a valid ObjectId' })
        let findBook = await bookModel.findOne({ _id: bookId }).select({ deletedAt: 0 })
        if (!findBook) return res.status(404).send({ status: false, msg: "no data found" })
        let findReview = await reviewModel.find({ bookId: bookId })

        let result = { ...findBook.toJSON(), reviewsData: findReview }

        res.status(200).send({ status: true, message: "Book-list", data: result })


    } catch (err)
    {
        res.status(500).send(err.message)
    }
}
// <=============================DeleteBooks==================================================>

exports.deleteBooks = async function (req, res) {
    try
    {
        const bookId = req.params.bookId
        const isValidBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!isValidBookId)
        {
            return res.status(404).send({ status: false, msg: "book is not available" })
        }
       
        const deleteBook = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() },
            { new: true })
        res.status(200).send({ status: true, msg: "Book successfully deleted", data: deleteBook })
    }
    catch (err)
    {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



