import { useRouter } from 'next/router';
import React from 'react'
function Navbar() {

  const router =useRouter();
  
  const handleLogout = () => {
      router.push('/');
    }
    const handleChat = () => {
      router.push('/homepage');
    }
  
    return (
    <div className="relative justify-between items-center p-4 border-[#dbd9d9] border-r-2 w-[5vw] ">
      <button onClick={handleChat} className='hover:bg-[#efefef] p-1.5 rounded-full focus:bg-[#e8f8ff] focus:outline-none focus:ring-2 focus:ring-[#e2e2e2]  '>
        <img src="/Group.svg" alt="Logo" className="h-6 w-6" />
      </button>
      <div className=" flex flex-col space-x-4  my-4">

        {/* <button className="my-4">
          <img src="/profile.jpg" alt="Profile" className="h-8 w-8 rounded-full" />
        </button> */}

        <button 
        className="mx-2"
        onClick={handleLogout}
        >
          <img src='/logout.svg' />
        </button>
      </div>
    </div>
  );
}


export default Navbar