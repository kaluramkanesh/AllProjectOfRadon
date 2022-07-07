const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')

exports.createReview = async function(req,res){
    try{
        const{reviewedBy,review,rating} = req.body
        let bookId = req.params.bookId.trim()
        let findBook = await booksModel.findOne({_id:bookId})
        if(!findBook) return res.status(404).send({status:false,msg:'your searched book is not exist'})
        let details={isDeleted:false}
        details.bookId = bookId.trim()
        details.reviewedBy=reviewedBy.trim()
        details.review = review.trim()
        details.rating = rating

        let setReview= await reviewModel.create(details)
        res.status(201).send({status: true,message:"Success",data:setReview})

    }catch(err){
        res.status(500).send(err.message)
    }
}