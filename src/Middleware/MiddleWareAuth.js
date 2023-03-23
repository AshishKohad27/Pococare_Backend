//middle ware
const jwt = require("jsonwebtoken")

const middleWareAuth = async (req, res, next) => {
    const accessToken = req.headers["authorization"];

    if (!accessToken) {
        return res.send({ message: "Unauthorized users" })
    }

    try {
        let verification = await jwt.verify(accessToken, "POCOCARE_27");
        if (verification) {
            next();
        }
    } catch (e) {
        return res.send({
            message: "Token Expired!",
            desc: e.message
        })
    }
}

module.exports = { middleWareAuth };