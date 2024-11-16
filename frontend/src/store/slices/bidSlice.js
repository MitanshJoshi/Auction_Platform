import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const bidSlice = createSlice({
    name:'bid',
    initialState:{
        loading: false,
    },
    reducers:{
        bidRequest(state,action)
        {
            state.loading = true;
        },
        bidSuccess(state,action)
        {
            state.loading = false;
        },
        bidFailed(state,action)
        {
            state.loading = false;
        },
        clearAllBidErrors(state,action)
        {
            state.loading = false;
        }
    }
})


export const placeBid=(id,data)=>async (dispatch)=>{
    dispatch(bidSlice.actions.bidRequest());
    try {
        const response = await axios.post(`/api/v1/bid/place/${id}`,data,{
            headers: {'Content-Type':'Application/json'}
        });
        dispatch(bidSlice.actions.bidSuccess());
        toast.success(response.data.message);
        dispatch(bidSlice.actions.clearAllBidErrors());
    } catch (error) {
        dispatch(bidSlice.actions.bidFailed());
        toast.error(error.response.data.message)
        console.log(error);
        dispatch(bidSlice.actions.clearAllBidErrors());
    }
}



export default bidSlice.reducer;