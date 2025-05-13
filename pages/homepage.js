import React from 'react'
import Navbar from '../components/Navbar'
import GeneralChat from '../components/GeneralChat'
import AllUsers from '../components/AllUsers'
import '../src/app/globals.css'

function Homepage() {
  return (
    <div className='h-screen w-full flex items-center justify-center bg-gradient-to-tl to-[#a2c0db] from-[#eab9da] '>
      <div className='flex  bg-[#fff] w-[96vw] h-[42vw]  rounded-sm shadow-lg'>
        <Navbar/>
        <AllUsers/>
        <GeneralChat/>
        
      </div>
    </div>
  )
}

export default Homepage