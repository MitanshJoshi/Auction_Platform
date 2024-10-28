import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SideDrawer from './Layout/SideDrawer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'

const App = () => {
  return (
    <BrowserRouter>
      <SideDrawer/>
      <Routes>
          <Route path='/' element={<Home/>}/>
      </Routes>
      <ToastContainer position='bottom-right'/>
    </BrowserRouter>
  )
}

export default App
