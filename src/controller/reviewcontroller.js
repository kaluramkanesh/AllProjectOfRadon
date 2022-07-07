const reviewModel = require('../models/reviewModel')

exports.createReview = async function(req,res){
    try{
        let review = req.body
        let setReview= await reviewModel.create(review)
        res.status(201).send({status: true,message:"Success",data:setReview})

    }catch(err){
        res.status(500).send(err.message)
    }
}