import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ref as dbRef, set, get } from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { auth, database, updateProfile } from '../firebase';

function UserInfo() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountCreated, setAccountCreated] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setEmail(currentUser.email);
      setUser(currentUser);
    } else {
      alert('Please sign up or log in.');
    }
  }, []);

  useEffect(() => {
    if (username.trim() === '') {
      setUsernameAvailable(null);
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      try {
        const usernameRef = dbRef(database, 'users/' + username);
        const snapshot = await get(usernameRef);
        setUsernameAvailable(!snapshot.exists());
      } catch (error) {
        setErrorMessage('Error checking username availability.');
      }
    }, 300);

    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [username]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Upload to Firebase Storage
    const storage = getStorage();
    const fileRef = storageRef(storage, `profile_images/${file.name}`);
    setUploading(true);
    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      setImageURL(downloadURL);
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMessage('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !usernameAvailable || !imageFile) {
      setErrorMessage('Please fill in all fields and choose an username.');
      return;
    }

    try {
      const userRef = dbRef(database, 'users/' + username);
      await set(userRef, {
        email,
        profileImage: imageURL || ''
      });

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: imageURL || ''
        });
      }

      setAccountCreated('Account created successfully');
      router.push('/homepage');
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to create account.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-tl to-[#a2c0db] from-[#eab9da] px-4'>
      <div className='w-full max-w-md bg-white p-6 md:p-10 rounded-2xl shadow-lg'>
        <form onSubmit={formSubmit} className='flex flex-col'>
          <h1 className='text-center text-2xl font-semibold  text-[#202020]'>Enter Details</h1>
          <div className="flex items-center justify-center h-[200px]">

            <div className="relative">

              <input
                type="file"
                id="fileUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-full border-4 border-dashed border-gray-400 bg-white hover:bg-gray-50 transition overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </label>
            </div>
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='border-2 p-2 rounded-lg w-full border-gray-300 font-medium m-1 focus:outline-none focus:border-[#8f8f8f]'
          />

          {usernameAvailable === false && (
            <p className="text-red-500 text-sm">Username is already taken</p>
          )}
          {usernameAvailable === true && (
            <p className="text-green-600 text-sm">Username is available</p>
          )}

          {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {accountCreated && <p className="text-green-700 text-sm">{accountCreated}</p>}

          <button
            type="submit"
            className="bg-[#2972e9] w-full max-w-sm mx-auto py-2 text-white px-4 rounded-full hover:bg-[#225dcc] transition-colors m-1"
            // disabled={!usernameAvailable}
          >
            Finish
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserInfo;
