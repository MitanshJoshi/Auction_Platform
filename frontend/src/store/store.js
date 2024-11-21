import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"
import commissionReducer from "./slices/commissionSlice"
import auctionReducer from "./slices/auctionSlice"
import bidReducer from "./slices/bidSlice"
import adminReducer from "./slices/superAdminSlice"


export const store = configureStore({
    reducer:{
        user:userReducer,
        commission:commissionReducer,
        auction:auctionReducer,
        bid:bidReducer,
        admin: adminReducer,
    },
})

