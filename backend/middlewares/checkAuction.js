import { Auction } from "../models/auctionSchema.js";
import ErrorHandler from "./error.js";

export const checkExpire=async(req,res,next)=>{
    const { id } = req.params;

    const auctionItem = await Auction.findById(id);

    if(!auctionItem)
    {
        return next(new ErrorHandler('Auction not found',404));
    }

    const now = new Date();

    if(new Date(auctionItem.startTime)>now)
    {
        return next(new ErrorHandler("Auction has not started yet",400));
    }

    if(new Date(auctionItem.endTime)<now)
    {
        return next(new ErrorHandler("Auction has already ended"),400);
    }
    next();
}