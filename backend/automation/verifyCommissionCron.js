import cron from 'node-cron'
import { PaymentProof } from '../models/paymentProofSchema.js'
import  {Commission}  from '../models/commissionSchema.js'
import { User } from '../models/userScema.js'
import { sendEmail } from '../utils/sendEmail.js'

export const verifyCommissionCron = () =>{
    cron.schedule("*/1 * * * *",async()=>{
        console.log('Running Verify Commission Cron');
        const approvedProofs = await PaymentProof.find({status: "Approved"});
        // console.log('approvedProofs are:',approvedProofs.length);
        
        
        for(const proofs of approvedProofs)
        {
            try {
                const user = await User.findById(proofs.userId);
                let userData = {};
                if(user)
                {
                    if(user.unpaidCommission >= proofs.amount)
                    {
                        userData = await User.findByIdAndUpdate(user._id,{
                            $inc:{
                                unpaidCommission: -proofs.amount,
                            }
                        },{new: true})

                        await PaymentProof.findByIdAndUpdate(proofs._id,{
                            status:"Settled",
                        });
                    }
                    else{
                        userData =  await User.findByIdAndUpdate(user._id,{
                            unpaidCommission:0,
                        },{new: true});
                        await PaymentProof.findByIdAndUpdate(proofs._id,{
                            status:"Settled",
                        });
                    }
                    await Commission.create({
                        amount: proofs.amount,
                        user: user._id,
                      });
                      const settlementDate = new Date(Date.now())
                        .toString()
                        .substring(0, 15);
                        const subject = `Your Payment Has Been Successfully Verified And Settled`;
                        const message = `Dear ${user.userName},\n\nWe are pleased to inform you that your recent payment has been successfully verified and settled. Thank you for promptly providing the necessary proof of payment. Your account has been updated, and you can now proceed with your activities on our platform without any restrictions.\n\nPayment Details:\nAmount Settled: ${proofs.amount}\nUnpaid Amount: ${userData.unpaidCommission}\nDate of Settlement: ${settlementDate}\n\nBest regards,\nBidSync Auction Team`;
                        sendEmail({ email: user.email, subject, message });
                }
                console.log(`User ${proofs.userId} paid commission of ${proofs.amount}`);
            } catch (error) {
                console.error(
                    `Error processing commission proof for user ${proofs.userId}: ${error.message}`
                  );
            }
                
        }
        
    })
}