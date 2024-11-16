import express from "express"
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { addAuctionItem, deleteAuction, getAllAuctions, getAuctionDetails, getMyAuctions, republishItem } from "../controllers/auctionController.js";
import { trackCommision } from "../middlewares/trackUnpaidCommission.js";

const router = express.Router();

router.post("/additem",isAuthenticated,trackCommision,isAuthorized("Auctioneer"),addAuctionItem);
router.get("/getall",getAllAuctions);
router.get("/getauctionitem/:id",isAuthenticated,getAuctionDetails);
router.get("/getmyauctions",isAuthenticated,getMyAuctions);
router.delete("/deleteauction/:id",isAuthenticated,isAuthorized("Auctioneer"),deleteAuction);
router.put('/republish/:id',isAuthenticated,isAuthorized("Auctioneer"),republishItem);


export default router;