const urlModel = require("../models/urlModel")

const isvalid = function (value) {
    if (typeof value === undefined || typeof value === null) { return false }
    if (typeof value !== "string" || value.trim().length == 0) { return false }
    true
}

const urlShortner = async function () {
    let data = req.body
    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "Body can not be empty" }) }

    let { urlCode, longUrl, shortUrl } = data

    if (!isvalid(longUrl)) { return res.status(400).send({ status: false, msg: `${longUrl} is not valid longUrl` }) }

    if (!/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})?$/.test(longUrl)) { return res.status(400).send({ status: false, msg: "invalid url please enter valid url" }) }

    if (!isvalid(shortUrl)) { return res.status(400).send({ status: false, msg: `${shortUrl} is not valid longUrl` }) }

    if (!isvalid(urlCode)) { return res.status(400).send({ status: false, msg: `${urlCode} is not valid urlCode` }) }

    let saveData = await urlModel.create(data)

    res.status(201).send({ status: true, data: saveData })
}
module.exports.urlShortner = urlShortner