import mongoose from "mongoose";
import ErrorHandler from "../middlewares/error.js"
import { Auction } from "../models/auctionSchema.js";
import { PaymentProof } from "../models/paymentProofSchema.js";
import { User } from "../models/userScema.js";
import {v2 as cloudinary} from 'cloudinary'


export const calculatedCommission = async(auctionId) =>{
  const auction = await Auction.findById(auctionId);
  if(!mongoose.Types.ObjectId.isValid(auctionId))
  {
    return next(new ErrorHandler("Invalid Id format",400));
  }

  const commissionRate = 0.05;
  const commission = auction.currentBid * commissionRate;
  return commission;
}
export const proofOfCommission = async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length===0)
    {
        return next(new ErrorHandler('Payment Proof Screensot required'),400);
    }

    const { proof } = req.files;
    const { amount, comment } = req.body;

    const user = await User.findById(req.user._id);

    if(!amount || !comment)
    {
        return next(new ErrorHandler('Amount & comment are required fields',400))
    }

    if(user.unpaidCommission===0)
    {
        return res.status(200).json({
            success:true,
            message:'You dont have any unpaid commission'
        })
    }

    if(user.unpaidCommission<amount)
    {
        return next(new ErrorHandler('Amount is more than your unpaid commission',403))
    }
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(proof.mimetype)) {
    return next(new ErrorHandler("Screensot format not supported.", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    proof.tempFilePath,
    {
        folder:'AUCTION_PLATFORM_PROOF',
    }
  );
  if(!cloudinaryResponse || cloudinaryResponse.error)
  {
    console.error('Cloudinary error:',cloudinaryResponse.error || 'Unknown cloudinary error');

    return next(new ErrorHandler('Failed to upload payment proof',500))
  }
  const commissionProof = await PaymentProof.create({
    userId: req.user._id,
    proof:{
        public_id: cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
    },
    amount,
    comment
  })

  res.status(200).json({
    success:true,
    message:'Proof Uploaded Successfully we will review it and respond within 24 hours.',
    commissionProof
  })


}

