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
import { fetchLeaderboard, GetUser } from './store/slices/userSlice';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import { getAllAuctionItem } from './store/slices/auctionSlice';
import Leaderboard from './pages/LeaderBoard';
import Auctions from './pages/Auctions';
import AuctionItem from './pages/AuctionItem';
import CreateAuction from './pages/CreateAuction';
import ViewMyAuctions from './pages/MyAuction';
import ViewAuctionDetails from './pages/MyAuctionDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';


axios.defaults.baseURL="https://auction-platform-backend.vercel.app";
axios.defaults.withCredentials=true;

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUser());
    dispatch(getAllAuctionItem());
    dispatch(fetchLeaderboard());
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
          <Route path='/leaderboard' element={<Leaderboard/>}/>
          <Route path='/auctions' element={<Auctions/>}/>
          <Route path='/auction/item/:id' element={<AuctionItem/>}/>
          <Route path='/create-auction' element={<CreateAuction/>}/>
          <Route path='/view-auction' element={<ViewMyAuctions/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/me" element={<UserProfile />} />
          <Route path='/auction/details/:id' element={<ViewAuctionDetails/>}/>
      </Routes>
      <ToastContainer position='bottom-right'/>
    </BrowserRouter>
  )
}

export default App
