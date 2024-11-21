import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify"; 
import axios from "axios";
import { getAllAuctionItem } from "./auctionSlice";

const adimnSlice = createSlice({
    name: "superAdmin",
    initialState:{
        loading: false,
        monthlyRevenue:[],
        totalAuctioneers:[],
        totalBidders:[],
        paymentProofs:[],
        singlePaymentProof:{},
    },
    reducers:{
        requestForMonthlyRevenue(state,action){
            state.loading=true;
        },
        successForMonthlyRevenue(state,action){
            state.loading=false;
            state.monthlyRevenue = action.payload;
        },
        failedForMonthlyRevenue(state,action){
            state.loading=false;
            state.monthlyRevenue = [];
        },
        requestForAllUsers(state,action){
            state.loading=true;
            state.totalAuctioneers=[];
            state.totalBidders=[];
        },
        successForAllUsers(state,action){
            state.loading=false;
            state.totalAuctioneers=action.payload.auctioneersArray;
            state.totalBidders=action.payload.biddersArray;
        },
        failedForAllUsers(state,action)
        {
            state.loading=false;
            state.totalAuctioneers=[];
            state.totalBidders=[];
        },
        requestForAllProofs(state,action){
            state.loading=true;
            state.paymentProofs=[];
        },
        successForAllProofs(state,action){
            state.loading=false;
            state.paymentProofs=action.payload;
        },
        failureForAllProofs(state,action){
            state.loading=false;
            state.paymentProofs=[];
        },
        requestForProof(state,action){
            state.loading=true;
            state.singlePaymentProof=[];
        },
        successForProof(state,action){
            state.loading=false;
            state.singlePaymentProof=action.payload;
        },
        failureForProof(state,action){
            state.loading=false;
            state.singlePaymentProof=[];
        },
        requestUpdateProof(state,action){
            state.loading = true;
        },
        successUpdateProof(state,action){
            state.loading = false;
        },
        failureUpdateProof(state,action){
            state.loading = false;
        },
        requestDeleteProof(state,action)
        {
            state.loading=true;
        },
        successDeleteProof(state,action)
        {
            state.loading=false;
        },
        failureDeleteProof(state,action)
        {
            state.loading=false;
        },

        requestDeleteAuctionItem(state,action)
        {
            state.loading = true;
        },

        successDeleteAuctionItem(state,action)
        {
            state.loading = false;
        },

        failureDeleteAuctionItem(state,action)
        {
            state.loading = false;
        },
        clearAllErrors(state,action)
        {
            state.loading=false;
            state.monthlyRevenue = state.monthlyRevenue;
            state.paymentProofs = state.paymentProofs;
            state.totalAuctioneers = state.totalAuctioneers;
            state.totalBidders = state. totalBidders;
            state.singlePaymentProof = {};
        }
    }
})

export const getMonthlyRevenue = () => async(dispatch) =>{
    dispatch(adimnSlice.actions.requestForMonthlyRevenue());
    try {
        const resp = await axios.get("/api/v1/superadmin/fetchmonthlyrevenue");
        dispatch(adimnSlice.actions.successForMonthlyRevenue(resp.data.totalMonthlyRevenue));
    } catch (error) {
        dispatch(adimnSlice.actions.failedForMonthlyRevenue());
        toast.error(error.response.data.message);
    }
}


export const getAllUsers = () => async(dispatch) => {
    dispatch(adimnSlice.actions.requestForAllUsers());
    try {
        const response = await axios.get("/api/v1/superadmin/fetchallusers");
        dispatch(adimnSlice.actions.successForAllUsers(response.data))
    } catch (error) {
        dispatch(adimnSlice.actions.failedForAllUsers());
        toast.error(error.response.data.message);
    }
}


export const getAllProofs = () => async(dispatch) => {
    dispatch(adimnSlice.actions.requestForAllProofs());
    try {
        const response = await axios.get("/api/v1/superadmin/getall/proofs");
        dispatch(adimnSlice.actions.successForAllProofs(response.data.paymentProofs))
    } catch (error) {
        dispatch(adimnSlice.actions.failureForAllProofs());
        toast.error(error.response.data.message);
    }
}


export const getProof = (id) => async(dispatch) =>{
    dispatch(adimnSlice.actions.requestForProof());
    try {
        const response = await axios.get(`/api/v1/superadmin/get/proof/${id}`);
        dispatch(adimnSlice.actions.successForProof(response.data.paymentProofDetails))
        toast.success(response.data.message);
    } catch (error) {
        dispatch(adimnSlice.actions.failureForProof());
        toast.error(error.response.data.message);
    }
}


export const updateProof = (id,status,amount) => async(dispatch) => {
    const data = {
        status:status,
        amount:amount,
    }
    dispatch(adimnSlice.actions.requestUpdateProof());
    try {
        const response = await axios.put(`/api/v1/superadmin/updateproof/${id}`,data);
        dispatch(adimnSlice.actions.successUpdateProof());
        toast.success(response.data.message);
        dispatch(adimnSlice.actions.clearAllErrors())
        dispatch(getAllProofs());
    } catch (error) {
        dispatch(adimnSlice.actions.successUpdateProof());
        toast.error(error.response.data.message);
    }
}


export const deleteProof =(id) => async(dispatch) => {
    dispatch(adimnSlice.actions.requestDeleteProof());
    try {
        const response = await axios.delete(`/api/v1/superadmin/deleteproof/${id}`);
        dispatch(adimnSlice.actions.successDeleteProof());
        toast.success(response.data.message);
        dispatch(getAllProofs());
    } catch (error) {
        dispatch(adimnSlice.actions.failureDeleteProof());
        toast.error(error.response.data.message);
    }
}

export const deleteItem =(id) => async(dispatch) => {
    dispatch(adimnSlice.actions.requestDeleteAuctionItem());
    try {
        const response = await axios.delete(`/api/v1/superadmin/auctionItem/delete/${id}`);
        dispatch(adimnSlice.actions.successDeleteAuctionItem());
        toast.success(response.data.message);
        dispatch(getAllAuctionItem());
    } catch (error) {
        dispatch(adimnSlice.actions.failureDeleteAuctionItem());
        toast.error(error.response.data.message);
    }
}


export const clearAllSuperAdminSliceErrors = () => (dispatch) =>{
    dispatch(adimnSlice.actions.clearAllErrors());
}



export default adimnSlice.reducer;

