import { User } from "../models/userScema.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token)
    {
        return next(new ErrorHandler("user not authenticated",400));

    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
};


export const isAuthorized = (...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return next(new ErrorHandler("You are not allowed to access this resource",403));
        }
        next();
    }
}
