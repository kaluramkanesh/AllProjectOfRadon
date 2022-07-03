const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const internSchema = mongoose.Schema({

    name: { type: String, required: true, toLowerCase: true, trim: true },

    email: { type: String, required: true, toLowerCase: true, trim: true, unique: true },

    mobile: { type: Number, required: true, unique: true },

    collegeId: { type: ObjectId, ref: "college" },

    isDeleted: { type: Boolean, default: false }
},

    { timestamps: true }
);
module.exports = mongoose.model("intern", internSchema)