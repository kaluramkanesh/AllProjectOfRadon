const urlModel = require("../models/urlModel")
const shortId = require("shortid")

const redis = require("redis");

const { promisify } = require("util");


//Connect to redis
const redisClient = redis.createClient(
  13086,
  "redis-13086.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("yTp6IU0JMPd7gaFhO3ls2XjsEWF4hiRX", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});


//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



const isvalid = function (value) {
  if (typeof value === undefined || typeof value === null) { return false }
  if (value.trim().length == 0) { return false }
  return true
}
const isValidKey = function (value) {
  if (!value) return false
  return true
}
const createUrlShortner = async function (req, res) {
  try {
    let data = req.body

    let { longUrl } = data


    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "Body can not be empty" }) }

    if (!isValidKey(longUrl)) { return res.status(400).send({ status: false, msg: "LongUrl field is required" }) }

    if (!isvalid(longUrl)) { return res.status(400).send({ status: false, msg: `${longUrl} is not valid longUrl` }) }

    if (!/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})?$/.test(longUrl)) { return res.status(400).send({ status: false, msg: "invalid url please enter valid url" }) }

    let AllReadPresent = await urlModel.findOne({ longUrl: longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })

    if (AllReadPresent) { return res.status(200).send({ status: false, msg: "This long url  is already Present in our dataBase", CreatedUrlData: AllReadPresent }) }


    let baseUrl = "http://localhost:3000"

    let urlCode = shortId.generate().toLocaleLowerCase()

    let shortUrl = (baseUrl + `/` + urlCode)

    data.shortUrl = shortUrl

    data.urlCode = urlCode

    let saveData = await urlModel.create(data)

    let saveDataAndResponse = { longUrl: saveData.longUrl, shortUrl: saveData.shortUrl, urlCode: saveData.urlCode }

    res.status(201).send({ status: true, data: saveDataAndResponse })
  }
  catch (Err) {
    console.log(Err)
    res.status(500).send({ status: false, msg: Err.message })
  }
}

exports.GetUrlByurlCode = async function (req, res) {
  try {
    let urlCode = req.params.urlCode

    // if (!(urlCode.length >= 7 && urlCode.length <= 14)) { return res.status(400).send({ status: false, msg: "invalid request" }) }

    let data = await GET_ASYNC(`${urlCode}`)
  
    if (data) { return res.status(302).redirect(data) }

    else {
      let findurlCode = await urlModel.findOne({ urlCode }).select({ longUrl: 1, _id: 0 })

      if (findurlCode) {
        await SET_ASYNC(`${urlCode}`, findurlCode.longUrl)

        return res.status(302).redirect(findurlCode.longUrl)
      }
      else {
        res.status(404).send({ status: false, msg: "No urlCode found" })
      }
    }
  }
  catch (Err) {
    console.log(Err)
    res.status(500).send({ status: false, msg: Err.message })
  }
}

module.exports.createUrlShortner = createUrlShortner