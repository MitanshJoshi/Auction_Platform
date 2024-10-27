import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        minLength: [3,'username must contain atleast 3 characters'],
        maxLength: [40,'username cannot exceed 40 characters'],
    },
    password:{
        type:String,
        selected:false,
        minLength: [6,'password must contain atleast 3 characters'],
        maxLength: [32,'password cannot exceed 40 characters'],
    },
    email: String,
    address: String,
    phone:{
        type:String,
        selected:false,
        minLength: [10,'phone number must contain 10 numbers'],
        maxLength: [10,'phone number must contain 10 numbers'],
    },
    profileImage:{
        public_id:{
            type:String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
    },
    paymentMetods:{
        bankTransfer:{
            bankAccountNumeber: String,
            bankAccountName: String,
            bankName: String,
        },
        razorpay:{
            razorpayAccountNumber: Number,
        },
        paypal:{
            paypalEmail: String,
        },
    },

    role:{
        type: String,
        enum:["Auctioneer","Bidder","Super Admin"]
    },
    unpaidCommission:{
        type: Number,
        default:0,
    },

    auctionsWon:{
        type: Number,
        default: 0,
    },
    moneySpent:{
        type:Number,
        default:0,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})



userSchema.pre("save",async function (next){
    if(!this.isModified("password"))
    {
        next();
    } 
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword=async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.generateToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}


export const User = mongoose.model("User",userSchema);