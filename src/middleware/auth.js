const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const bookModel = require("../models/booksModel")
const userModel = require("../models/userModel")


exports.Authenticate = function (req, res, next) {


    try {
        let token = req.headers["x-api-key"];
        if (!token) {
            return res.status(401).send({ status: false, msg: "token is not present in headers" });
        } else {
            const decodedToken = jwt.verify(token, "GroupNo-27",

                function (err, token) {
                    if (err) {
                        return null;
                    } else {
                        return token;
                    }
                }
            );
            if (decodedToken == null) {
                return res.status(401).send({ status: false, msg: "invalid token" });
            }
        }
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }

}

exports.Authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        let decodedtoken = jwt.verify(token, "GroupNo-27")
        let loggedInUserId = decodedtoken.id
        let bookId = req.params.bookId
        let findBook = await bookModel.findOne({_id:bookId})
        let verifyId
        if (loggedInUserId !== bookId) return res.status(403).send({ status: false, msg: "the user is unauthorized" })

        next();
    } catch (err) {
        res.status(500).send(err.message)
    }
}

