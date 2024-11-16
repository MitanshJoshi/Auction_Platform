import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const auctionSlice = createSlice({
    name: 'auction',
    initialState:{
        loading: false,
        itemDetails: {},
        auctionDetail: {},
        auctionBidders: {},
        myAuctions: [],
        allAuctions: [],
    },
    reducers:{
        getMyAuctionRequest(state,action)
        {
            state.loading = true;
        },
        getMyAuctionSuccess(state,action)
        {
            state.loading = false;
            state.myAuctions = action.payload;
        },
        getMyAuctionFailed(state,action)
        {
            state.loading = false;
            state.myAuctions = state.myAuctions;
        },
        createAuctionRequest(state, action)
        {
            state.loading = true;
        },
        createAuctionSuccess(state, action){
            state.loading=false;
        },
        createAuctionFailed(state, action){
            state.loading = false;
        },
        getAllAuctionItemRequest(state,action)
        {
            state.loading = true;
        },
        getAllAuctionItemSuccess(state,action)
        {
            state.loading = false;
            state.allAuctions = action.payload;
        },
        getAllAuctionItemFailed(state,action)
        {
            state.loading = false;
        },
        getAuctionDetailRequest(state,action){
            state.loading = true;
        },
        getAuctionDetailSuccess(state,action){
            state.loading=false;
            state.auctionDetail = action.payload.auctionItem;
            state.auctionBidders = action.payload.bidders;
        },
        getAuctionDetailFailed(state,action){
            state.loading = false;
            state.auctionDetail = state.auctionDetail;
            state.auctionBidders = state.auctionBidders;
        },
        resetSlice(state,action)
        {
            state.loading = false;
            state.itemDetails = state.itemDetails;
            state.auctionDetail = state.auctionDetail;
            state.myAuctions = state.myAuctions;
            state.allAuctions = state.allAuctions;

        }
    }
})

export const getAllAuctionItem = () => async(dispatch) =>{
    dispatch(auctionSlice.actions.getAllAuctionItemRequest());
    try {
        const response = await axios.get('/api/v1/auction/getall');
        dispatch(auctionSlice.actions.getAllAuctionItemSuccess(response.data.auctions));
        dispatch(auctionSlice.actions.resetSlice());
    } catch (error) {
        dispatch(auctionSlice.actions.getAllAuctionItemFailed());
        console.log(error);
        dispatch(auctionSlice.actions.resetSlice());
    }
};

export const getAuctionDetail = (id) => async (dispatch) => {
    dispatch(auctionSlice.actions.getAuctionDetailRequest());
    try {
      const response = await axios.get(`/api/v1/auction/getauctionitem/${id}`);
      console.log(response.data);
      
      dispatch(auctionSlice.actions.getAuctionDetailSuccess(response.data));
    } catch (error) {
      dispatch(auctionSlice.actions.getAuctionDetailFailed());
      console.error("Failed to fetch auction details:", error);
    }
  };

export const createAuction = (data) => async(dispatch) => {
    dispatch(auctionSlice.actions.createAuctionRequest());
    try {
        const response = await axios.post('/api/v1/auction/additem',data,{
            headers: { 'Content-Type':'multipart/form-data' }
        })

        dispatch(auctionSlice.actions.createAuctionSuccess());
        toast.success(response.data.message);
        dispatch(auctionSlice.actions.resetSlice());
    } catch (error) {
        dispatch(auctionSlice.actions.createAuctionFailed());
        toast.error(response.data.message);
        dispatch(auctionSlice.actions.resetSlice());
        
    }
}


export const getMyAuctions = () => async(dispatch) =>{
    dispatch(auctionSlice.actions.getMyAuctionRequest());
    try {
        const response  = await axios.get('/api/v1/auction/getmyauctions');
        dispatch(auctionSlice.actions.getMyAuctionSuccess(response.data.auctions));
        dispatch(auctionSlice.actions.resetSlice());
    } catch (error) {
        dispatch(auctionSlice.actions.getMyAuctionFailed());
        toast.error(error.response.data.message);
        dispatch(auctionSlice.actions.resetSlice());        
    }
}

export default auctionSlice.reducer;