import JWT from "jsonwebtoken"
import userModel from "../models/user.model.js"

export const requireSignIn = async(req, res ,next) => {
try {
    
    const decode =  JWT.verify(req.headers.authorization, process.env.JWT_SECRET)

    req.user = decode
     next()
} catch (error) {
    console.log(error);
}


}

export const isAdmin = async(req, res, next) => {
    
    const  user = await userModel.findById(req.user._id)
     
    if (user.role !== 1) {
        return res.send({
          success: false,
          message: "Admin  unAuthorized acces",
        })
    }else{
       next()
    }

}