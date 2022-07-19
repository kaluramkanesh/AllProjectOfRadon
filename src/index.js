const express = require("express")
const mongoose = require("mongoose")
const router = require("./routes/router")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
mongoose.connect("mongodb+srv://kaluram123:iKetOTUhK5vten7w@cluster0.4yhyg.mongodb.net/group53Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is connected successfully........"))
    .catch((Err) => console.log(Err))

app.use("/", router)

app.listen(process.env.PORT || 3000, function () {
    console.log(`Server is connected on Port ${process.env.PORT || 300} ✅✅✅`)
})