import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SideDrawer from './Layout/SideDrawer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import axios from 'axios';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CommissionProof from './pages/CommissionProof';
import { useDispatch } from 'react-redux';
import { GetUser } from './store/slices/userSlice';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';


axios.defaults.baseURL="http://localhost:5000";
axios.defaults.withCredentials=true;

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUser());
  }, [])
  
  return (
    <BrowserRouter>
      <SideDrawer/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/submit-commission' element={<CommissionProof/>}/>
          <Route path='/how-it-works' element={<HowItWorks/>}/>
          <Route path='/about-us' element={<About/>}/>
      </Routes>
      <ToastContainer position='bottom-right'/>
    </BrowserRouter>
  )
}

export default App
