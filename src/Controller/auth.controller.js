const authModel = require("../Model/auth.model")

const userSignUp = async ({ email, password }) => {
    try {
        //1. find user Already exist or not
        let userExistOrNot = await authModel.find({ email });
        console.log('userExistOrNot:', userExistOrNot)
        if (userExistOrNot.length !== 0){
            
        }


            return {
                data: userExistOrNot,
                message: "SignUp Successfully!",
                flag: true,
                desc: "",
            }


    } catch (e) {
        return {
            data: [],
            message: "Error Occure",
            desc: e.message
        }
    }
}

module.exports = {
    userSignUp
}