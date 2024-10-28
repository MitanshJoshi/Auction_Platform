import mongoose from "mongoose";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userScema.js";
import { v2 as cloudinary } from "cloudinary";

export const addAuctionItem = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Auction Item Image Required", 400));
  }

  const { image } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }
  try {
    const {
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime,
    } = req.body;
  
    if (
      !title ||
      !description ||
      !category ||
      !condition ||
      !startingBid ||
      !startTime ||
      !endTime
    ) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    console.log("startTime:", new Date(startTime).toISOString());
    console.log("currentTime:", new Date(Date.now()).toISOString());
  
    if (new Date(startTime) < Date.now()) {
      return next(
        new ErrorHandler("Start time must be greater than present time", 400)
      );
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return next(new ErrorHandler("start time must be less than end time", 400));
    }
  
    const activeAuction = await Auction.find({
      createdBy:req.user._id,
      endTime: { $gt:Date.now() },
    }) 
  
    if(activeAuction.length>0)
    {
      return next(new ErrorHandler("Already have one active auction",400))
    }
  
  
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "AUCTION_PLATFORM_AUCTIONIMAGE",
      }
    );
  
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(
        "cloudinary error:",
        cloudinaryResponse.error || "cloudinary error"
      );
      return next(
        new ErrorHandler("Error uploading auction image to cloudinary",500)
      );
    }
  
  
    const auctionItem = await Auction.create({
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime,
      image:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
      },
      createdBy:req.user._id,
    })
  
  
    return res.status(200).json({
      success:true,
      message:`Auction item created and will be listed on auction page at ${startTime}`,
      auctionItem
    })
  } catch (error) {
    return next (new ErrorHandler(error.message || "Failed to create auction",500));
  }
};


export const getAllAuctions=async(req,res,next)=>{
  const auctions = await Auction.find();
  return res.status(200).json({
    success:true,
    auctions,
  })
}

export const getAuctionDetails=async(req,res,next)=>{
  const {id} = req.params;
  console.log(id);
  
  if(!mongoose.Types.ObjectId.isValid(id))
  {
    return next(new ErrorHandler("Invalid id format",400));
  }
  const auctionItem = await Auction.findById(id);

  if(!auctionItem)
  {
    return res.status(404).json({
      success:false,
      message:"No Auction Found"
    })
  }

  return res.status(200).json({
    success:true,
    auctionItem
  })
}


export const getMyAuctions = async(req,res,next)=>{
  const userId = req.user._id;
  if(!userId)
  {
    return next(new ErrorHandler("User not Authenticated",400));
  }

  const auctions = await Auction.find({createdBy:userId});
  return res.status(200).json({
    success:true,
    auctions
  })
}

export const deleteAuction = async(req,res,next)=>{
  const {id} = req.params;

  if(!mongoose.Types.ObjectId.isValid(id))
  {
    return next(new ErrorHandler("Invalid id format",400));
  }

  const auction = await Auction.findById(id);
  if(!auction)
  {
    return next(new ErrorHandler("No Auction Found",404));
  }

  await auction.deleteOne();
  return res.status(200).json({
    status:200,
    message:"Item deleted successfully"
  })
}

export const republishItem = async(req,res,next)=>{
  const { id } = req.params;


  if(!mongoose.Types.ObjectId.isValid(id))
  {
    return next(new ErrorHandler('Incorrect id format',400));
  } 

  let auctionItem = await Auction.findById(id);
  if(!auctionItem)
  {
    return next(new ErrorHandler('No Auction Found',400));
  }

  if(!req.body.startTime || !req.body.endTime)
  {
    return next(new ErrorHandler('start time and end time is required',400))
  }
  if(new Date(auctionItem.endTime) > Date.now())
  {
    return next(new ErrorHandler('Auction is already active, cannot republish',400))
  }

  let data={
    startTime:new Date(req.body.startTime),
    endTime:new Date(req.body.endTime),
  }

  if(data.startTime > data.endTime)
  {
    return next(new ErrorHandler('Start time must be smaller than end time',400));
  }

  if(auctionItem.highestBidder)
  {
    const highestBidder = await User.findById(auctionItem.highestBidder);
    highestBidder.moneySpent -= auctionItem.currentBid;
    highestBidder.auctionsWon -= 1;
    await highestBidder.save();
  }
  data.bids=[];
  data.commissionCalculated=false;
  data.currentBid=0;
  data.highestBidder=null;

  auctionItem = await Auction.findByIdAndUpdate(id,data,{
    new:true,
    runValidators:true,
    useFindAndModify: false,
  })

  await Bid.deleteMany({auctionItem:auctionItem._id});
  const createdBy = await User.findByIdAndUpdate(req.user._id,{unpaidCommission:0},{
    runValidators:false,
    new:true,
    useFindAndModify:false,
  });
  res.status(200).json({
    success:true,
    auctionItem,
    message:`Auction republishhed and will be active on ${req.body.startTime}`,
    createdBy
  })

}