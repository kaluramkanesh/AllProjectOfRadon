const bookModel = require("../models/booksModel")
const validator = require("../validator/validation")



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
