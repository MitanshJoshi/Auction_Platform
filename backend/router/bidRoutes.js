import express from "express"
import { placeBid } from "../controllers/bidController.js"
import {isAuthenticated,isAuthorized} from '../middlewares/auth.js'
import { checkExpire } from "../middlewares/checkAuction.js";
const router = express.Router();

router.post('/place/:id',isAuthenticated,isAuthorized('Bidder'),checkExpire,placeBid)


export default router;