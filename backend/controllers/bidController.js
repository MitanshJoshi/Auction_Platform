import ErrorHandler from '../middlewares/error.js';
import {Auction} from '../models/auctionSchema.js'
import { Bid } from '../models/bidSchema.js';
import { User } from '../models/userScema.js';


export const placeBid = async(req,res,next)=>{
    const { id } = req.params;

    const auctionItem  = await Auction.findById(id);
    if(!auctionItem)
    {
        return next(new ErrorHandler("Auction Item not found",404));
    }

    const { amount } = req.body;

    if(!amount)
    {
        return next(new ErrorHandler('Bid amount must be greater than the xurrent bid',404));
    }

    if(amount<=auctionItem.currentBid)
    {
        return next(new ErrorHandler('Amount must be greater than current bid',400));
    }

    if(amount<auctionItem.startingBid)
    {
        return next(new ErrorHandler('Bid must be greater than minimum starting bid'));
    }

    try {
        const existingBid = await Bid.findOne({
            "bidder.id":req.user._id,
            auctionItem:auctionItem._id,            
        })
        const existingBidInAuction = auctionItem.bids.find(
            (bid)=> bid.userId.toString()===req.user._id.toString()
        )
        console.log(existingBid);
        
        
        if(existingBid && existingBidInAuction)
        {
            existingBidInAuction.amount = amount;
            existingBid.amount = amount;
            await existingBidInAuction.save();
            await existingBid.save();
            auctionItem.currentBid = amount;
        }
        else{
            const bidderDetails = await User.findById(req.user._id);
            const bid = await Bid.create({
                amount,
                bidder:{
                    id:bidderDetails._id,
                    userName:bidderDetails.userName,
                    email:bidderDetails.email,
                    profileImage: bidderDetails.profileImage?.url
                },
                auctionItem:auctionItem._id,
            });

            auctionItem.bids.push({
                userId:req.user._id,
                userName: bidderDetails.userName,
                profileImage:bidderDetails.profileImage?.url,
                amount,
            })
            auctionItem.currentBid = amount; 
        }
        await auctionItem.save();

        return res.status(201).json({
            success:true,
            messae:'Bids placed.',
            currentBid: auctionItem.currentBid
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to place bid',500));
    }


}