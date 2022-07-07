const bookModel = require("../models/booksModel")
const validator = require("../validator/validation")



exports.createBook = async function (req, res) {
    try
    {

        const book = req.body
        
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = book

        const saved = await bookModel.create(book)
        res.status(201).send({ status: true, data: saved })
    }
    catch (err)
    {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

exports.getBook=async function(req, res){
    try{
        const bookData=await bookModel.find({isDeleted:false})
        if(bookData.length==0){res.status(404).send({status:false,msg:"No books found "})}
        return res.status(200).send({status:true,data:bookData})

    }
    catch (err){
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}
