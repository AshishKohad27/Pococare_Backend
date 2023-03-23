//1. Import
const express = require("express");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { userSignUp } = require("../Controller/auth.controller");
const authModel = require("../Model/auth.model");
const blacklistModel = require("../Model/blacklist.model");
const { middleWareAuth } = require("../Middleware/MiddleWareAuth");

//2. Create
const authRoutes = express.Router();

//checking for other pages
authRoutes.get("/page", middleWareAuth, async (req, res) => {
    res.send("About Page")
})
//checking for other pages


//3. Methods

//3.1 Signup
authRoutes.post("/signup", async (req, res) => {
    //1. Getting data from body
    const { email, password } = req.body;

    //2. making hashed password
    const hash = await argon2.hash(password);
    try {
        //3. if both email and password exist then we will proceeds
        if (email && password) {
            //4. find user Already exist or not
            let userExistOrNot = await authModel.find({ email });
            // console.log("userExistOrNot:", userExistOrNot);

            //5. user exist with this email id
            if (userExistOrNot.length !== 0) {
                return res.status(200).send({
                    message: "User With this Email Already Exists",
                    data: userExistOrNot[0],
                });
            }

            //6. create user if he/she not exist with hashed password
            let createUser = new authModel({
                email,
                password: hash,
            });
            await createUser.save();

            return res.status(201).send({
                message: "User Created Successfully!",
                data: createUser,
            });
        } else {
            return res.status(400).send({
                message: "Please Fill All Details",
                data: [],
            });
        }
    } catch (e) {
        console.log(e.message);
        return res.status(401).send({
            message: "Error Occurs",
            data: [],
            desc: e.message,
        });
    }
});

//3.2 Login
authRoutes.post("/login", async (req, res) => {
    //1. Getting data from body
    const { email, password } = req.body;
    // console.log('email, password:', email, password)
    try {
        const userExistOrNot = await authModel.findOne({ email });

        //1. if user not signup in our app he have to signup first
        if (userExistOrNot.length === 0) {
            return res.status(400).send({
                message: "User With this Email Id Not Exist!",
            });
        }

        //2. password verify by argon2 package
        if (await argon2.verify(userExistOrNot.password, password)) {
            //3. Creating Token
            const token = jwt.sign(
                { _id: userExistOrNot._id, email: userExistOrNot.email },
                "POCOCARE_27",
                { expiresIn: "20s" }
            );

            //4. Create Refresh Token
            const refreshToken = jwt.sign(
                { _id: userExistOrNot._id },
                "POCOCARE_27_REFRESH",
                { expiresIn: "1min" }
            );

            return res
                .status(201)
                .send({ message: "Login Successfully!", token, refreshToken });
        } else {
            return res.status(400).send({
                message: "Wrong Credentials",
            });
        }
    } catch (e) {
        console.log(e.message);
        return res.status(401).send({
            message: "Error Occurs",
            desc: e.message,
        });
    }
});

//3.3 Refresh Token
authRoutes.post("/refresh", async (req, res) => {
    //1. Taking token from headers
    const refreshToken = req.headers["authorization"];

    //2. if token not present in header
    if (!refreshToken) {
        return res.status(401).send("Unauthorized User");
    }

    try {
        //3. refresh token first verify if it's not expired then we create new token
        const verification = jwt.verify(refreshToken, "POCOCARE_27_REFRESH");
        if (verification) {

            const auth = await authModel.findById({ _id: verification._id });
            // console.log("auth:", auth);

            //4. creation of new token with user id and email in token
            const newToken = jwt.sign(
                { _id: auth._id, email: auth.email },
                "POCOCARE_27",
                { expiresIn: "20s" }
            );
            return res.send({ token: newToken });
        }
    } catch (e) {
        return res.status(401).send({
            message: "Token Expired!",
            desc: e.message,
        });
    }
});

authRoutes.post("/logout", async (req, res) => {
    const token = req.headers['authorization'];
    // console.log('token:', token)
    const tokenPush = new blacklistModel({
        blackListItem: token
    })
    await tokenPush.save();
    return res.send({ message: "user logged out successfully" })
});

//4. Exports
module.exports = authRoutes;
