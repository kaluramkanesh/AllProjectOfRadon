const bookModel = require("../models/booksModel")
const validator = require("../validator/validation")



exports.createBook = async function (req, res) {
    try
    {

        const bookData = req.body

        const fieldAllowed = ["title", "excerpt", "userId", "ISBN", "category", "subcategory","releasedAt"]
        const keyOf = Object.keys(bookData);
        const receivedKey = fieldAllowed.filter((x) => !keyOf.includes(x));
        if (receivedKey.length)
        { 
            return res
                .status(400)
                .send({ status: "false", msg: `${receivedKey} field is missing` });
        }

       const {title, excerpt, userId, ISBN, category, subcategory,releasedAt} = bookData

        const isDupliCateTitle = await bookModel.findOne({title:title})
        if(isDupliCateTitle){
            return res.status(400).send({status:false,msg:"Title is already present"})
        }

        const isvalidUserId = await userModel.findById(userId)
        if (!isvalidUserId){
            return res.status(404).send({status:false,msg:"User not found"})
        }

        const isDupliCateISBN = await bookModel.findOne({ISBN:ISBN})
        if(!isDupliCateISBN){
            return res.status(400).send({status:false,msg:"ISBN is already present"})
        }

        if(!(/^\d{4}-\d{2}-\d{2}$/.test(releasedAt))){
            return res.status(400).send({status:false, msg:`${releasedAt} is an invalid date, formate should be like this YYYY-MM-DD`})
        }

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
        const bookData = await bookModel.find({ isDeleted: false })
        if (bookData.length == 0) { res.status(404).send({ status: false, msg: "No books found " }) }
        return res.status(200).send({ status: true, data: bookData })

    }
    catch (err)
    {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}
