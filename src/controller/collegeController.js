const collegeModel = require("../Models/collegeModel")
const internModel = require("../Models/internModel")

const isvalid = function (value) {
    if (typeof value === undefined || typeof value === null) return false

    if (typeof value !== "string" || value.trim().length == 0) return false

    return true
}
/*.......................................Start's Create College Api's....................................*/
const CreateCollege = async function (req, res) {
    try {
        let data = req.body

        //  let { name, fullName, logoLink } = data
        /*=========================== Start's Body validation=======================*/
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body can not be empty" })
        /*=========================== End Body validation=======================*/

        /*=========================== Start's Name validation=======================*/
        if (!data.name) return res.status(400).send({ status: false, msg: "name field is required" })

        if (!isvalid(data.name)) return res.status(400).send({ status: false, msg: `${data.name} is not valid name please enter valide name` })

        if (!/^[a-z\s]*$/.test(data.name)) return res.status(400).send({ status: false, msg: `${data.name} is not valid name ` })
        /*=========================== End Name validation=======================*/


        /*=========================== Start's fullName validation=======================*/
        if (!data.fullName) return res.status(400).send({ status: false, msg: "fullName field is required" })

        if (!isvalid(data.fullName)) return res.status(400).send({ status: false, msg: `${data.fullName} is not valid name please enter valid fullName` })

        if (!/^[a-zA-Z -._,\s]*$/.test(data.fullName)) return res.status(400).send({ status: false, msg: `${data.fullName} is not valid fullName ` })
        /*=========================== End fullName validation=======================*/


        /*=========================== Start's logoLink validation=======================*/
        if (!data.logoLink) return res.status(400).send({ status: false, msg: "logolink field is required" })

        if (!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(data.logoLink.trim())) return res.status(400).send({ status: false, msg: "Please enter valid url" })
        /*=========================== End logoLink validation=======================*/

        /*=========================== Start's isDeleted validation=======================*/
        if (data.isDeleted) {

            if (typeof data.isDeleted !== "boolean") return res.status(400).send({ status: false, msg: "isDeleted will cantain only boolean which is true or false" })

        }
        /*=========================== End isDeleted validation=======================*/
        let findData = await collegeModel.find({ name: data.name }).select({ name: 1 })

        if (findData.length !== 0) return res.status(400).send({ status: false, msg: "name is already present in our DataBase" })

        let saveData = await collegeModel.create(data)

        res.status(201).send({ status: true, data: saveData })
    }
    catch (Error) {

        res.status(500).send({ status: false, msg: Error.message })
    }
    /*.......................................End Create College Api's....................................*/


}
/*.....................................Start's Get CollegeDetails Api's.................................. */
const getCollegeDetails = async function (req, res) {
    try {
        let data = req.query.collegeName

        if (!data) return res.status(400).send({ status: false, msg: " collegeName is required in  query " })

        let findData = await collegeModel.find({ name: data }).select({ name: 1, fullName: 1, logoLink: 1 })
        console.log(findData)
        if (findData == 0) return res.status(400).send({ status: false, msg: `Not found college with name of this ${data} college` })

        let findIntern = await internModel.find({ collegeId: findData[0]._id }).select({ name: 1, email: 1, mobile: 1 })

        if (findIntern == 0) return res.status(400).send({ status: false, msg: `No intern found with this college ` })
        delete findData[0]._doc._id

        findData[0]._doc.interns = findIntern

        res.status(200).send({ status: true, data: findData[0] })
    }
    catch (Error) {
        res.status(500).send({ status: false, msg: Error.message })
    }
}
/*.....................................Start's Get CollegeDetails Api's.................................. */
module.exports = { CreateCollege, getCollegeDetails }