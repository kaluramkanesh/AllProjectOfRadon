const bookModel = require("../models/booksModel")
const reviewModel = require('../models/reviewModel')
const userModel = require('../models/userModel')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId



exports.createBook = async function (req, res) {
    try {
        const bookData = req.body
        const fieldAllowed = ["title", "excerpt", "userId", "ISBN", "category", "subcategory", "releasedAt"]
        const keyOf = Object.keys(bookData);
        const receivedKey = fieldAllowed.filter((x) => !keyOf.includes(x));
        if (!receivedKey.length) {
            return res
                .status(400)
                .send({ status: "false", msg: `${receivedKey} field is missing` }); 
        }

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = bookData
        /**********************************Start's title validation********************************/

        if (!/^[a-zA-Z 0-9 ,-_'@$&]$/) return res.status(400).send({ status: false, msg: `${title} is not valid title` })

        const isDupliCateTitle = await bookModel.findOne({ title: title })

        if (isDupliCateTitle) { return res.status(400).send({ status: false, msg: "title is already present in our DataBase" }) }
        /**********************************End title validation********************************/

        /**********************************start's userID validation********************************/

        let isValidUserID = mongoose.Types.ObjectId.isValid(userId)
        console.log(isValidUserID)
        if (!isValidUserID) return res.status(400).send({ status: false, msg: `${userId} userID has something wrong` })

        const isvalidUserId = await userModel.findById(userId)

        if (!isvalidUserId) { return res.status(404).send({ status: false, msg: "User not found" }) }

        /**********************************End userID validation********************************/

        /**********************************Start's ISBN validation********************************/

        const isDupliCateISBN = await bookModel.findOne({ ISBN: ISBN })
        if (isDupliCateISBN) {
            return res.status(400).send({ status: false, msg: "ISBN is already present in our DataBase" })
        }
       
        
        if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(releasedAt)) {
        return res.status(400).send({ status: false, msg: `${releasedAt} is an invalid date, formate should be like this YYYY-MM-DD` })
        }

        if (!/^[a-zA-Z .,'-_]$/.test(category)) return res.status(400).send({ status: false, msg: `${category} is not valid category ` })

        if (!/^[a-zA-Z .',-_]$/.test(subcategory)) return res.status(400).send({ status: false, msg: `${subcategory} is not valid subcategory please enter valid subcategory` })


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
        if (Object.keys(filters).length != 0) {
            if (filters.userId != 24) { return res.status(400).send(" UserId Invalid ") }
        }
        if (Object.keys(filters).length === 0) {

            let books = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

            if (books.length == 0) { return res.status(404).send({ status: false, msg: "No result found" }) }
            let sortedBooks = books.sort(function (a, b) {
                var titleA = a.title.toUpperCase(); // ignore upper and lowercase
                var titleB = b.title.toUpperCase(); // ignore upper and lowercase
                if (titleA < titleB) {
                    return -1; //titleA comes first
                }
                if (titleA > titleB) {
                    return 1; // titleB comes first
                }
                return 0;
            })
            return res.status(200).send({ status: true, data: sortedBooks })

        } else {
            Object.keys(filters).forEach(x => filters[x] = filters[x].trim())
            if(filters.userId){
                if (filters.userId.length !== 24) { return res.status(400).send({status:false,msg:" UserId Invalid "}) }
                }

            if (filters.subcategory) {
                if (filters.subcategory.includes(",")) {
                    let subcatArray = filters.subcategory.split(",").map(String).map(x => x.trim())
                    filters.subcategory = { $all: subcatArray }
                }
            }
        }
        filters.isDeleted = false;
        let filteredBooks = await bookModel.find(filters).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        if (filteredBooks.length === 0) return res.status(404).send({ status: false, msg: "No such data available" })
        else {
            let sortedBooks = filteredBooks.sort(function (a, b) {
                var titleA = a.title.toUpperCase(); // ignore upper and lowercase
                var titleB = b.title.toUpperCase(); // ignore upper and lowercase
                if (titleA < titleB) {
                    return -1; //titleA comes first
                }
                if (titleA > titleB) {
                    return 1; // titleB comes first
                }
                return 0;
            })
            return res.status(200).send({ status: true, data: sortedBooks })

        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

exports.getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!(ObjectId.isValid(bookId))) return res.status(400).send({ status: false, msg: 'Enter a valid ObjectId' })
        let findBook = await bookModel.findOne({ _id: bookId }).select({ deletedAt: 0 })
        if (!findBook) return res.status(404).send({ status: false, msg: "no data found" })
        let findReview = await reviewModel.find({ bookId: bookId })

        let result = { ...findBook.toJSON(), reviewsData: findReview }

        res.status(200).send({ status: true, message: "Book-list", data: result })


    } catch (err) {
        res.status(500).send(err.message)
    }
}
// <=============================DeleteBooks==================================================>

exports.deleteBooks = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const isValidBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!isValidBookId) {
            return res.status(404).send({ status: false, msg: "book is not available" })
        }
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: `${bookId} is not a valid ObjectId😥😥` })

        const deleteBook = await bookModel.findByIdAndUpdate(bookId, { isDeleted: true, deletedAt: new Date() },
            { new: true })
        res.status(200).send({ status: true, msg: "Book successfully deleted😍😍", })
    }
    catch (err) {

        res.status(500).send({ msg: err.message })
    }
}
// <=============================UpdateBooks==================================================>

exports.updateBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId
        // if (bookId== null||bookId=="") { 
        //     return res.status(400).send(" BookId is not available")
        //  }
        if (bookId.length != 24) {
            return res.status(400).send(" BookId Invalid ")
        }
        let book = await bookModel.findById(bookId);
        if (Object.keys(book).length == 0 || book.isDeleted == true) {
            return res.status(404).send(" No such data found ")
        }
        let reqData = req.body;
        let upData = {};
        if (reqData.title) {
            upData.title = reqData.title;
        }
        if (reqData.excerpt) {
            upData.excerpt = reqData.excerpt;
        }
        if (reqData.ISBN) {
            upData.ISBN = reqData.ISBN;
        }
        if (reqData.releasedAt) {
            upData.releasedAt = reqData.releasedAt;
        }

        if (Object.keys(upData).length == 0) {
            return res.status(400).send(" No data to update ")
        }
        // upData.releasedAt = new Date()
        let updated = await bookModel.findOneAndUpdate({ _id: bookId }, upData, { new: true })
        res.status(200).send({ status: true, Data: updated })


    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }

}



