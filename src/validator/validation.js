
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
    let { title, name, phone, email, password, address } = data
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body can not be empty" })
    /**************************title field validation*************************/
    if (isValidKey(title)) return res.status(400).send({ status: false, msg: "title field is required" })

    if (!isvalid(title)) return res.status(400).send({ status: false, msg: `${title} is not valid` })

    if (!/^(Mr|Miss|Mrs)*$/.test(title)) return res.status(400).send({ status: false, msg: "title field will accept only Mr or Miss or Mrs" })

    /**************************title field validation*************************/

    /**************************name field validation*************************/
    if (isValidKey(name)) return res.status(400).send({ status: false, msg: "name field is required" })

    if (!isvalid(name)) return res.status(400).send({ status: false, msg: `${name} is not valid name` })

    if (!/[a-zA-Z ._-,']*{2,15}$/.test(name)) return res.status(400).send({ status: false, msg: `${name} please enter valid name` })

    /**************************name field validation*************************/

    /**************************Phone field validation*************************/

    if (isValidKey(phone)) return res.status(400).send({ status: false, msg: "Phone Number field is required" })
    if (!isvalid(phone)) return res.status(400).send({ status: false, msg: `${phone} is not valid  mobile number` })
    if (!/[0-9]*{10,10}$/.test(phone)) return res.status(400).send({ status: false, msg: `${phone} it will containt only number not accept space or special charecture` })
    /**************************Phone field validation*************************/

/**************************email field validation*************************/
if(isValidKey(email))return res.status(400).send({status:false,msg:"email field is required"})
if(!isvalid(email))return res.status(400).send({status:false,msg:`${email} is not valid emaiil`})
/**************************email field validation*************************/

/**************************Password field validation*************************/
if(isValidKey(password))return res.status(400).send({status:false,msg:"password field is required"})
if(!isvalid(password))return res.status(400).send({status:false,msg:`${password} is not valid password`})
/**************************Password field validation*************************/
    next();
}

// module.exports = { userValidation };
