
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { auth } from '../firebase';
import { useRouter } from 'next/router';
import ProfilePopup from '../pages/editProfile';


function Navbar() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.push('/login');
    }
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <>
      <div className="hidden sm:flex flex-col items-center h-full border-r-2 border-[#dcdcdc] w-[5vw] py-2">
       
        <button
          onClick={() => router.push('/homepage')}
          className="hover:bg-gray-200 rounded-full p-2   "
        >
          <Image src="/Group.svg" alt="Chat" width={24} height={24} />
        </button>

        
        <button
          onClick={() => setShowProfile(true)}
          className="rounded-full m-2 border-2 border-[#696969]"
        >
          <img
            src={user?.photoURL || '/default-avatar.png'}
            alt="Profile"
            className="h-7 w-7 rounded-full object-cover"
          />
        </button>

       
        <button onClick={handleLogout} className="p-2 m-1">
          <Image src="/logout.svg" alt="logout" width={22} height={22} />
        </button>
      </div>

     
      {showProfile && (
        <ProfilePopup user={user} onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}

export default Navbar;
