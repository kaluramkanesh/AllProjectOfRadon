const internModel = require("../Models/internModel")
const collegeModel = require("../Models/collegeModel")
const isvalid = function (value) {
    if (typeof value === undefined || typeof value === null) return false
    if (typeof value !== "string" || value.trim().length == 0) return false
    return true
}
/*......................................End Create Intern Api......................................... */
const createIntern = async function (req, res) {
    try {
        let data = req.body
        //   let { name, email, mobile, collegeName ,isDeleted} = data

        /*========================Start's validation body========================= */
        console.log(data)
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Body can not be empty" });
        /*========================End validation body========================= */

        /*========================Start's name validation========================= */
        if (!data.name) return res.status(400).send({ status: false, msg: "name field is required" })

        if (!isvalid(data.name)) return res.status(400).send({ status: false, msg: `${data.name} is not valid` })

        if (!/^[a-zA-Z -._\s]*$/.test(data.name)) return res.status(400).send({
            status: false, msg: `${data.name} 
        please enter valid name` })
        /*========================End name validation========================= */

        /*=========================Start's isDeleted validation=================== */
        if (data.isDeleted) {

            if (typeof data.isDeleted !== "boolean") return res.status(400).send({ status: false, msg: "is Deleted cantaint only boolean value which is true or false" })
        }
        /*=========================End isDeleted validation=================== */

        /*========================Start's email validation========================= */
        if (!data.email) return res.status(400).send({ status: false, msg: "email field is required" })

        if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(data.email)) return res.status(400).send({ status: false, msg: `${data.email} please enter valid email` })

        let emailId = await internModel.find({ email: data.email }).select({ email: 1 })

        if (emailId.length != 0) return res.status(400).send({ status: false, msg: "Email is already exist in our DataBase" })

        /*========================End email validation========================= */

        /*========================Star's Mobile Number validation========================= */
        if (!data.mobile) return res.status(400).send({ status: false, msg: "mobile number field is required" })

        if (!/^[6789](\+\d{1,3}[- ]?)?\d{9}$/.test(data.mobile)) return res.status(400).send({ status: false, msg: `${data.mobile} Please enter valid mobile number` })

        let mobileNumber = await internModel.find({ mobile: data.mobile }).select({ mobile: 1 })

        if (mobileNumber.length != 0) return res.status(400).send({ status: false, msg: "Mobile number is already exist in our DataBase" })
        /*========================End Mobile Number validation========================= */

        /*========================Star's College Name validation========================= */
        if (!data.collegeName) return res.status(400).send({ status: false, msg: "collegeName field is required" })

        if (!isvalid(data.collegeName)) return res.status(400).send({ status: false, msg: `${data.collegeName} is not valid college name` })

        if (!/^[a-zA-Z\s]*$/.test(data.collegeName)) res.status(400).send({ status: false, msg: `${data.collegeName} is not valid college name please enter valid college name` })
        /*========================End College Name validation========================= */
        let college = await collegeModel.findOne({ name: data.collegeName, isDeleted: false }).select({ _id: 1 })

        if (college.length == 0) return res.status(400).send({ status: false, msg: "No college found" })

        data.collegeId = college._id

        let saveData = await internModel.create(data)

        res.status(201).send({ status: true, data: saveData })
    }
    catch (Error) {
        res.status(500).send({ status: false, msg: Error.message })
    }

}
/*......................................End Create Intern Api......................................... */
module.exports = {
    createIntern
}