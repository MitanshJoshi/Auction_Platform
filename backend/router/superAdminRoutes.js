import express from 'express'
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';
import { deleteAuction, deletePaymentProof, fetchAllUsers, getAllPaymentProofDetails, getAllPaymentProofs, monthlyRevenue, updateProofStatus } from '../controllers/superAdmin.js';

const router = express.Router();

router.delete('/auctionItem/delete/:id',isAuthenticated,isAuthorized('Super Admin'),deleteAuction);
router.get('/getall/proofs',isAuthenticated,isAuthorized('Super Admin'),getAllPaymentProofs);
router.get('/get/proof/:id',isAuthenticated,isAuthorized('Super Admin'),getAllPaymentProofDetails);
router.put('/updateproof/:id',isAuthenticated,isAuthorized('Super Admin'),updateProofStatus);
router.delete('/deleteproof/:id',isAuthenticated,isAuthorized('Super Admin'),deletePaymentProof);
router.get('/fetchallusers',isAuthenticated,isAuthorized('Super Admin'),fetchAllUsers);
router.get('/fetchmonthlyrevenue',isAuthenticated,isAuthorized('Super Admin'),monthlyRevenue);

export default router;