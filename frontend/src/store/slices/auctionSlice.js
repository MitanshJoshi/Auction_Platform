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
        republishItemRequest(state,action){
            state.loading = true;
        },
        republishItemSuccess(state,action){
            state.loading=false;
        },
        republishItemFailed(state,action){
            state.loading=false;
        },
        deleteItemRequest(state,action){
            state.loading = true;
        },
        deleteItemSuccess(state,action){
            state.loading=false;
        },
        deleteItemFailed(state,action){
            state.loading=false;
        },
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
        dispatch(getAllAuctionItem());
        dispatch(auctionSlice.actions.resetSlice());
    } catch (error) {
        dispatch(auctionSlice.actions.createAuctionFailed());
        toast.error(error.response.data.message);
        dispatch(auctionSlice.actions.resetSlice());
        
    }
}


export const deleteItem = (id) => async(dispatch) =>{
    dispatch(auctionSlice.actions.deleteItemRequest());
    try {
        const response = await axios.delete(`/api/v1/auction/deleteauction/${id}`);
        dispatch(auctionSlice.actions.deleteItemSuccess());
        toast.success(response.data.message);
        dispatch(getMyAuctions());
        dispatch(getAllAuctionItem());
        dispatch(auctionSlice.actions.resetSlice());
    } catch (error) {
        dispatch(auctionSlice.actions.deleteItemFailed());
        toast.error(error.response.data.message);
        dispatch(auctionSlice.actions.resetSlice());
    }
}


export const republishItem = (data,id) => async(dispatch) =>{
    dispatch(auctionSlice.actions.republishItemRequest());
    try {
        const response = await axios.put(`/api/v1/auction/republish/${id}`,data);
        dispatch(auctionSlice.actions.republishItemSuccess());
        toast.success(response.data.message);
        dispatch(getMyAuctions());
        dispatch(getAllAuctionItem());
        dispatch(auctionSlice.actions.resetSlice());
    } catch (error) {
        dispatch(auctionSlice.actions.republishItemFailed());
        toast.error(error.response.data.message);
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