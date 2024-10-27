import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userScema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateJwtToken } from "../utils/jwtToken.js";

export const register = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required", 400));
  }

  const { profileImage } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    razorpayAccountNumber,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !password || !phone || !address || !role) {
    return next(new ErrorHandler("Please fill full form", 400));
  }

  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return new ErrorHandler("please provide your full bank details", 400);
    }
    if (!razorpayAccountNumber) {
      return new ErrorHandler("please provide your razorpayAccountNumber", 400);
    }
    if (!paypalEmail) {
      return new ErrorHandler("please provide your paypalEmail", 400);
    }
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(new ErrorHandler("user already registered", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "AUCTION_PLATFORM_USERS",
    }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(
      "cloudinary error:",
      cloudinaryResponse.error || "cloudinary error"
    );
    return next(
      new ErrorHandler("Error uploading profile image in cloudinary")
    );
  }

  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    paymentMetods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      razorpay: {
        razorpayAccountNumber,
      },
      paypal: {
        paypalEmail,
      },
    },
  });
  generateJwtToken(user, "User Registered", 201, res);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("No user found", 404));
  }

  const isPaswordMatch = await user.comparePassword(password);

  if (!isPaswordMatch) {
    return next(new ErrorHandler("password is incorrect", 404));
  }

  generateJwtToken(user, "Login successfull", 200, res);
};
export const getProfile = async (req, res, next) => {
  const user = req.user;
  return res.status(200).json({
    status: 200,
    user,
  });
};
export const logout = async (req, res, next) => {
  return res
    .status(200)
    .cookie("token", " ", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User Logged Out",
    });
};
export const fetchLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ moneySpent: { $gt: 0 } })
      .sort({ moneySpent: -1 })
      .limit(10);
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};
