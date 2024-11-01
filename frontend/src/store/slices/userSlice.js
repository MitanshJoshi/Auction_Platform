import { createSlice, isAsyncThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
    name:"user",
    initialState:{
        loading:false,
        isAuthenticated:false,
        user:{},
        leaderboard:[],
        error:null,
    },

    reducers:{
        fetchUser(state,action)
        {
            state.loading=true,
            state.isAuthenticated=false;
            state.user={};
        },
        fetchUserSuccess(state,action)
        {
            state.loading=false,
            state.isAuthenticated=true;
            state.user=action.payload;
        },
        fetchUserFailed(state,action)
        {
            state.loading=false,
            state.isAuthenticated=false;
            state.user={};
        },
        registerUser(state,action)
        {
            state.loading=true,
            state.isAuthenticated=false;
            state.user={};
        },
        registerUserSuccess(state,action)
        {
            state.loading=false,
            state.isAuthenticated=true;
            state.user=action.payload;
        },
        registerUserFailed(state,action)
        {
            state.loading=false,
            state.isAuthenticated=false;
            state.user={};
        },
        loginUser(state,action)
        {
            state.loading=true,
            state.isAuthenticated=false;
            state.user={};
        },
        loginUserSuccess(state,action)
        {
            state.loading=false,
            state.isAuthenticated=true;
            state.user=action.payload;
        },
        loginUserFailed(state,action)
        {
            state.loading=false,
            state.isAuthenticated=false;
            state.user={};
        },
        logoutSuccess(state,action)
        {
            state.isAuthenticated=false;
            state.user={};
        },
        logoutFailed(state,action)
        {
            state.user=state.user;
            state.isAuthenticated=state.isAuthenticated;
            state.loading=false;
        },
        clearAllErrors(state,action)
        {
            state.user=state.user;
            state.isAuthenticated=state.isAuthenticated;
            state.loading=false;
            state.leaderboard=state.leaderboard;  
        }
    }
})


export const register = (data,navigate) => async(dispatch)=>{
    dispatch(userSlice.actions.registerUser());
    try {
        const response = await axios.post('/api/v1/user/register',data,{
            headers:{"Content-Type":"multipart/form-data"}
        });
        dispatch(userSlice.actions.registerUserSuccess(response.data.user));
        toast.success(response.data.message);
        navigate('/')
        dispatch(userSlice.actions.clearAllErrors())
    } catch (error) {
        dispatch(userSlice.actions.registerUserFailed());
        toast.error(error.response.data.message);
        dispatch(userSlice.actions.clearAllErrors())
        
    }

}

export const login = (data,navigate) => async(dispatch)=>{
    dispatch(userSlice.actions.loginUser());
    try {
        const response = await axios.post('/api/v1/user/login',data,{
            headers:{"Content-Type":"Application/json"}
        });
        dispatch(userSlice.actions.loginUserSuccess(response.data.user));
        toast.success(response.data.message);
        navigate('/')
        dispatch(userSlice.actions.clearAllErrors())
    } catch (error) {
        dispatch(userSlice.actions.loginUserFailed());
        toast.error(error.response.data.message);
        dispatch(userSlice.actions.clearAllErrors())
        
    }

}


export const logout=async(dispatch,navigate)=>{
    try {
        const response = await axios.post("/api/v1/user/logout");
        dispatch(userSlice.actions.logoutSuccess());
        toast.success(response.data.message);
        navigate('/');
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.logoutFailed());
        toast.error(error.data.message);
        dispatch(userSlice.actions.clearAllErrors());
    }
}

export const GetUser = () => async(dispatch) =>{
    dispatch(userSlice.actions.fetchUser());
    try {
        const response = await axios.get('/api/v1/user/getuser');
        dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.fetchUserFailed());
        dispatch(userSlice.actions.clearAllErrors());
    }

}



export default userSlice.reducer