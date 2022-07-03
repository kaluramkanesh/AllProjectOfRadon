const express = require("express")
const collegeController = require("../controller/collegeController")
const internController=require("../controller/internController")
const router = express.Router()

router.get("/test/Api", function (req, res) {
    res.send("Hello this is test api")
})
router.post("/functionup/colleges", collegeController.CreateCollege)
router.post("/functionup/interns",internController.createIntern)
router.get("/functionup/collegeDetails",collegeController.getCollegeDetails)
module.exports = router