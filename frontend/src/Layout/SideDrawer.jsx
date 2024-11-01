import { logout } from "@/store/slices/userSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import {MdDashboard, MdLeaderboard} from "react-icons/md"
import { RiAuctionFill, RiInstagramFill, RiInstanceFill } from "react-icons/ri";
import { FaEye, FaFacebook, FaFile, FaFileInvoice, FaFileInvoiceDollar } from "react-icons/fa";
import { IoIosCreate, IoMdCloseCircleOutline } from "react-icons/io";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
const SideDrawer = () => {
  const [show, setshow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout(navigate));
  };
  
  return (
    <div>
      <div
        onClick={() => setshow(!show)}
        className="fixed right-5 top-5 bg-[#D6482B] text-white text-3xl p-2 rounded-md hover:bg-[#b8381e]"
      >
        <GiHamburgerMenu/>
      </div>
      <div className={`w-[100%] sm:w-[300px] bg-[#f6f4f0] fixed h-full top-0 ${show ? 'left-0' : 'left-[-100%]'} transition-all duration-100 p-4 flex flex-col lg:left-0 border-r-[1px] border-r-stone-500`}>
        <div></div>
        <Link to={'/'} className="mb-4 relative font-semibold">Bid<span className="text-[#D6482B]">Sync</span></Link>
        <ul className="flex flex-col gap-3">
          <li>
          <Link to={'/auctions'} className="font-semibold hover:text-[#D6482B] gap-2 items-center flex"><RiAuctionFill/> Auctions</Link>
          </li>
          <li>
          <Link to={'/leaderboard'} className="font-semibold hover:text-[#D6482B] gap-2 items-center flex"><MdLeaderboard/> Leaderboard</Link>
          </li>
          {
            isAuthenticated && user && user.role=="Auctioneer" && (
            <>
              <li>
              <Link to={'/submit-commission'} className="font-semibold hover:text-[#D6482B] gap-2 items-center flex"><FaFileInvoiceDollar/> Submit Commission</Link>
              </li>

              <li>
              <Link to={'/create-auction'} className="font-semibold hover:text-[#D6482B] gap-2 items-center flex"><IoIosCreate/> Create Auction</Link>
              </li> 
              <li>
              <Link to={'/view-auction'} className="font-semibold hover:text-[#D6482B] gap-2 items-center flex"><FaEye/> View My Auctions</Link>
              </li>
            </>)
          }
          {
            isAuthenticated && user && user.role == 'Super Admin' && (
            <>
               <Link to={'/dashboard'} className="font-semibold hover:text-[#D6482B] gap-2 items-center flex"><MdDashboard/> Dashboard</Link>
            
            </>)
          }
        </ul>
        {
          !isAuthenticated ? (
            <>
            <div className="my-4 gap-4 flex text-white">
              <Link className="bg-[#D6482B] py-2 px-4 flex items-center justify-center rounded-lg" to={"/signup"}>Signup</Link>
              <Link className="text-[#DECCBE] bg-transparent border-[#DECCBE] border-[1px] hover:bg-[#fffefd] hover:text-[#fdba88] py-2 px-6 flex items-center justify-center rounded-lg" to={"/login"}>Login</Link>
            </div>
            </>
          ):(
           <>
            <div className="my-4 gap-4 flex">
            <button className="bg-[#D6482B] text-white py-2 px-4 flex items-center justify-center rounded-lg" onClick={handleLogout}>Logout</button>
            </div>
          </>)
        }
        <hr className="border-t-[#D6482B]"></hr>
        <ul className="flex flex-col gap-3 mt-4">
        <li>
          <Link to={'/how-it-works'} className="font-semibold hover:text-[#D6482B] gap-2 items-center flex"><SiGooglesearchconsole/> How it works</Link>
          </li>
          <li>
          <Link to={'/about-us'} className="font-semibold hover:text-[#D6482B] gap-2 items-center flex"><BsFillInfoSquareFill/> About us</Link>
          </li>
        </ul>
        <IoMdCloseCircleOutline onClick={()=>setshow(!show)} className="cursor-pointer absolute top-0 right-4 text-[20px] sm:hidden mt-4"/>
        <div className="absolute bottom-0 mb-3">
        <div className="flex gap-2 items-center mb-2">
          <Link to={'/'} className="bg-white text-stone-500 text-xl rounded-sm hover:text-blue-700"><FaFacebook/></Link>
          <Link to={'/'} className="bg-white text-stone-500 text-xl rounded-sm hover:text-pink-500"><RiInstagramFill/></Link>
        </div>
        <Link to={'/contact-us'} className="text-stone-500 font-semibold hover:text-[#D6482B] hover:transition-all">Contact us</Link>
        <p className="text-stone-500">
  &copy; 
  <span className="group cursor-pointer">
    <span className=" group-hover:text-black font-semibold">Bid</span>
    <span className=" group-hover:text-[#D6482B] font-semibold">Sync</span>
  </span>, LLC.
</p>

        <p className="text-stone-500">Designed by <Link to={'/'} className="hover:text-[#D6482B] font-semibold transition-all">Mitansh Joshi</Link></p>
      </div>
      </div>
      
    </div>
  );
};

export default SideDrawer;
