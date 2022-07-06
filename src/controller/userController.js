const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")


const isvalid = function (value) {
    if (typeof value === undefined || typeof value === null) return false
    if (typeof value === String || value.trim().length == 0) return false
    return true
}
/**************************************Start's Create User Api's****************************************/
exports.createUser = async function (req, res) {

    try {
        let data = req.body
        let savedData = await userModel.create(data);
      
        res.status(201).send({ status: true, data: savedData })
    } catch (Error) {
        res.status(500).send({ status: false, msg: Error.message })
    }
}
// /**************************************End Create User Api's****************************************/


