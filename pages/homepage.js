import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import GeneralChat from '../components/GeneralChat'
import AllUsers from '../components/AllUsers'
import '../src/app/globals.css'
import { useRouter } from 'next/router';
import Image from 'next/image'


function Homepage() {
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    router.push('/');
  }

  return (
    <div className='h-screen w-full flex items-center justify-center bg-gradient-to-tl to-[#a2c0db] from-[#eab9da]'>
      <div className="flex bg-white w-[96vw] h-[92vh] sm:h-[50vh] md:h-[45vh] lg:h-[42vw] rounded-sm shadow-lg">
        <Navbar />
        {!showChat && <AllUsers className="flex sm:hidden" />}


        <div className='hidden sm:flex w-full h-full flex flex-col'>
          <GeneralChat />
        </div>
        {showChat && (
          <div className='sm:hidden w-full h-full flex flex-col'>
            <GeneralChat />
          </div>
        )}
      </div>

      <div className="sm:hidden w-[20vw] fixed top-9 right-2  flex justify-around py-3 ">
        <button
          className="text-sm font-medium text-blue-600"
          onClick={() => setShowChat(prev => !prev)}
        >
          <Image src="/Group.svg"
            alt="General Chat Icon"
            width={24}
            height={24}
            quality={100}
            priority />
        </button>


        <button
          className="text-sm font-medium text-red-500"
          onClick={handleLogout}
        >
          <Image src="/logout.svg"
            alt="Logout Icon"
            width={20}
            height={20}
            quality={100}
            priority />
        </button>
      </div>


    </div>
  )
}

export default Homepage