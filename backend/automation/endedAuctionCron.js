import cron from 'node-cron';
import { Auction } from '../models/auctionSchema.js';
import { calculatedCommission } from '../controllers/commissionController.js';
import { Bid } from '../models/bidSchema.js';
import {sendEmail} from '../utils/sendEmail.js'
import { User } from '../models/userScema.js';


export const endedAuctionCron = () =>{
    cron.schedule("*/1 * * * *",async() => {
        const now = new Date();
        console.log("Current time (now):", now);

        console.log('Cron for ended auction running...');

        const allAuctions = await Auction.find({ commissionCalculated: false });

        const endedAuctions = allAuctions.filter(auction => new Date(auction.endTime) < new Date(now));

        console.log(`Found ${endedAuctions.length} auctions to process`);
        for(const auction of endedAuctions)
        {
            try {
                const commissionAmount = await calculatedCommission(auction._id);
                auction.commissionCalculated = true;
                const highestBidder = await Bid.findOne({
                    auctionItem: auction._id,
                    amount: auction.currentBid
                })
                console.log('highestBidder is:',highestBidder);
                
                const auctioneer = await User.findById(auction.createdBy);
                console.log('auctioneer',auctioneer);
                
                auctioneer.unpaidCommission = commissionAmount;
                if(highestBidder)
                {
                    auction.highestBidder = highestBidder.bidder.id;
                    await auction.save();
                    const bidder = await User.findById(highestBidder.bidder.id);
                    console.log('bidder is',bidder);
                    
                    await User.findByIdAndUpdate(bidder._id,{
                        $inc:{
                            moneySpent:highestBidder.amount,
                            auctionsWon:1,
                        }
            
                    },{new: true})
                    await User.findByIdAndUpdate(
                        auctioneer._id,
                        {
                            $inc:{
                                unpaidCommission: commissionAmount,
                            }
                        },
                        {new:true}
                    );
                    console.log('reaced ere1');
                    const subject = `Congratulations! You won te auction for ${auction.title}`;
                    console.log('reaced ere2');
                    console.log(bidder.userName,auction.title,auctioneer.email,auctioneer.paymentMetods.bankTransfer.bankAccountName,auctioneer.paymentMetods.bankTransfer.bankAccountNumber,auctioneer.paymentMetods.bankTransfer.bankName);
                    
                    const message = `Dear ${bidder.userName}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email} \n\nPlease complete your payment using one of the following methods:\n\n1. **Bank Transfer**: \n- Account Name: ${auctioneer.paymentMetods.bankTransfer.bankAccountName} \n- Account Number: ${auctioneer.paymentMetods.bankTransfer.bankAccountNumber} \n- Bank: ${auctioneer.paymentMetods.bankTransfer.bankName}\n\n2. **Easypaise**:\n- You can send payment via Easypaise: ${auctioneer.paymentMetods.razorpay.razorpayAccountNumber}\n\n3. **PayPal**:\n- Send payment to: ${auctioneer.paymentMetods.paypal.paypalEmail}\n\n4. **Cash on Delivery (COD)**:\n- If you prefer COD, you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront, use any of the above methods.\n- The remaining 80% will be paid upon delivery.\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is completed by [Payment Due Date]. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards,\nBidSync Auction Team`;
                    console.log('reaced ere3');
                    console.log("SENDING EMAIL TO HIGHEST BIDDER");
                    sendEmail({email: bidder.email, subject, message})
                    console.log("Successfully send to highest bidder");
                }
            } catch (error) {
                
            }
        }
    })
}
