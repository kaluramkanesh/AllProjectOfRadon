const express = require("express")
const mongoose = require("mongoose")
const route = require("./routes/route")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
mongoose.connect("mongodb+srv://kaluram123:iKetOTUhK5vten7w@cluster0.4yhyg.mongodb.net/kaluram123?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB Connect Succssesfully.........."))
    .catch(Error => console.log(Error))

app.use("/", route)

app.listen(process.env.PORT || 4000, function () {
    console.log("Express is running on port", process.env.PORT || 4000)
})