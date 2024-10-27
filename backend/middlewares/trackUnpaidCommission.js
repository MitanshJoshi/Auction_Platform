import { User } from "../models/userScema.js";
import ErrorHandler from "./error.js";

export const trackCommision = async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    if(user.unpaidCommission>0)
    {
        return next(new ErrorHandler('You have unpaid commissions pay them before accessing this resource',400))
    }
    next();
}