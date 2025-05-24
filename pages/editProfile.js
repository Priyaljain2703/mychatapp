import React from 'react';

function ProfilePopup({ user, onClose }) {
  if (!user) return null;

  return (
    <>
     
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,.2)] z-40"
        onClick={onClose}
      ></div>

   
      <div className="absolute top-25 left-[6vw] z-50">
        <div className="bg-white w-80 rounded-md shadow-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-1 right-3 text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>

          <div className="text-center">
            <img
              src={user.photoURL || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 mx-auto rounded-full object-cover border mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {user.displayName || 'Not set'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePopup;
