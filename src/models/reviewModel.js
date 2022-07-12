const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        ref: "book",
        required: true
    },
    reviewedBy: {
        type: String,
<<<<<<< HEAD
        required: true,
=======
        
        default: 'Guest',
>>>>>>> 2bd1b926397fb78cb5c392a9d7628e9e0340811f
    },
    reviewedAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        minlenght: 1,
        maxlenght: 5,
        required: true

    },

    review: {
        type: String
    },

    isDeleted: {
        type: Boolean,
        default: false

    }
}, { timestamps: true });

module.exports = mongoose.model("bookreview", reviewSchema)









