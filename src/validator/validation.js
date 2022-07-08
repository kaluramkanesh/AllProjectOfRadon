const userModel = require("../models/userModel")
const mongoose = require('mongoose')

// <=======================validation Function=================================================>
const isvalid = function (value) {
    if (typeof value === undefined || typeof value === null) return false
    if (typeof value === String || value.trim().length == 0) return false
    return true
}
const isValidKey = function (value) {
    if (!value) return false
    true
}
exports.userValidation = async function (req, res, next) {
    let data = req.body
    let { title, name, phone, email, password } = data
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body can not be empty" })
    /**************************title field validation*************************/
    if (isValidKey(title)) return res.status(400).send({ status: false, msg: "title field is required" })

    if (!isvalid(title)) return res.status(400).send({ status: false, msg: `${title} is not valid` })

    if (!/^(Mr|Miss|Mrs)*$/.test(title)) return res.status(400).send({ status: false, msg: "title field will accept only Mr or Miss or Mrs" })

    /**************************title field validation*************************/

    /**************************name field validation*************************/
    if (isValidKey(name)) return res.status(400).send({ status: false, msg: "name field is required" })

    if (!isvalid(name)) return res.status(400).send({ status: false, msg: `${name} is not valid name` })

    if (!/^[a-zA-Z .']{2,15}$/.test(name)) return res.status(400).send({ status: false, msg: `${name} please enter valid name` })

    /**************************name field validation*************************/

    /**************************Phone field validation*************************/

    if (isValidKey(phone)) return res.status(400).send({ status: false, msg: "Phone Number field is required" })

    if (!isvalid(phone)) return res.status(400).send({ status: false, msg: `${phone} is not valid  mobile number` })

    if (!/^[6789]\w{9}*$/.test(phone)) return res.status(400).send({ status: false, msg: `${phone} it will containt only number not accept space or special charecture` })

    let findPhoneNumber = await userModel.findOne({ phone: phone }).select({ phone: 1 })

    if (findPhoneNumber) return res.status(400).send({ status: false, msg: "phone number is already present in our data base" })

    /**************************Phone field validation*************************/

    /**************************email field validation*************************/
    if (isValidKey(email)) return res.status(400).send({ status: false, msg: "email field is required" })

    if (!isvalid(email)) return res.status(400).send({ status: false, msg: `${email} is not valid emaiil` })

    if (!/^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(email)) return res.status(400).send({ status: false, msg: `${email} email is not valid email` })

    let findEmail = await userModel.findOne({ email: email }).select({ email: 1 })

    if (findEmail) return res.status(400).send({ status: false, msg: "Email is already present in our data base" })

    /**************************email field validation*************************/

    /**************************Password field validation*************************/
    if (isValidKey(password)) return res.status(400).send({ status: false, msg: "password field is required" })

    if (!isvalid(password)) return res.status(400).send({ status: false, msg: `${password} is not valid password` })

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,15}$/.test(password)) return res.status(400).send({ status: false, msg: `${password} password shoulde be strong` })

    /**************************Password field validation*************************/


    /**************************Address field validation*************************/
    /*************Street validation*************/
    if (!isvalid(data.address["street"])) return res.status(400).send({ status: false, msg: `${data.address["street"]} is not valid street` })

    if (!/^[a-zA-Z .,-_]{2,15}$/.test(data.address["street"])) return res.status(400).send({ status: false, msg: `${data.address["street"]} please enter valid street name` })
    /*************Street validation*************/

    /*************City validation*************/
    if (!isvalid(data.address["city"])) return res.status(400).send({ status: false, msg: `${data.address["city"]} is not valid city name` })

    if (!/^[a-zA-Z .-,_]{2,20}$/.test(data.address["city"])) return res.status(400).send({ status: false, msg: `${data.address["city"]} is not valid city name please enter valid city name` })
    /*************City validation*************/

    /*************Pincode validation*************/
    if (isvalid(data.address["pincode"])) return res.status(400).send({ status: false, msg: `${data.address["pincode"]} is not valid pincode ` })

    if (!/\d/.test(data.address["pincode"])) return res.status(400).send({ status: false, msg: ` please enter pincode upto 6 digit's` })
    /*************Pincode validation*************/
    next();
}

exports.reviewValidation = async function (req, res, next) {
    try {
        const fieldAllowed = ["reviewedBy","rating"];
        const data = req.body;
        const keyOf = Object.keys(data);
        const receivedKey = fieldAllowed.filter((x) => !keyOf.includes(x));
        if (receivedKey.length) {
            return res
                .status(400)
                .send({ status: "false", msg: `${receivedKey} field is missing` });
        }
        const { reviewedBy, reviewedAt, rating } = data

        if (!(/^[A-Za-z ]{1,15}$/.test(reviewedBy))) return res.status(400).send({ status: false, msg: "reiviewedBy can't be blank or invalid" })
        if (!(/^[1-5]{1,1}$/.test(rating))) return res.status(400).send({ status: false, msg: "enter valid ratings🤷‍♂️🤷‍♂️" })

        next();
    } catch (err) {
        res.status(500).send(err.message)
    }
}
