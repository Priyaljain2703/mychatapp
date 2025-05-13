import React, { useState } from 'react'
import Link from 'next/link';
import '../../src/app/globals.css'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth, database } from '../../firebase';
import { ref, set, get } from 'firebase/database';


import { useRouter } from "next/router";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
// import { FcGoogle } from 'react-icons/fc';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchErr, setMatchErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const router = useRouter();

 

  const provider = new GoogleAuthProvider();

  const formSubmit = async (e) => {
    e.preventDefault();
   
    const passwordError = vaildatePassword(password);
     if (!password || !email || !confirmPassword || !username) {
      setErrorMessage('Please fill out all the fields');
      return;
    }
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setMatchErr(true);
      setErrorMessage('Password doesn\'t match');
      return;
    }

   

  


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const usernameRef = ref(database, 'users/' + username);
      const snapshot = await get(usernameRef);
      if (snapshot.exists()) {
        setErrorMessage('Username is already taken.');
        return; 
      }

      
      await set(ref(database, 'users/' + username), {
        email: email,
      });

      await updateProfile(user, { displayName: username });

      setErrorMessage('');
      setAccountCreated('Account Created');
      router.push('/homepage'); 
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Email already exists');
      } else {
        setErrorMessage('Failed to create account');
      }
      setAccountCreated('');
    }
  };


  // const handelGoogleLogin = async () => {
  //   setLoading(true);

  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     alert(`${user.email} logged in successfully`);
  //   }
  //   catch (err) {
  //     console.log(err.message);
  //     setErrorMessage('Google login failed');
  //   }
  //   finally {
  //     setLoading(false);
  //   }
  // };

 const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    vaildatePassword(e.target.value);
    if (confirmPassword && value !== confirmPassword) {
      setMatchErr(true);
    } else {
      setMatchErr(false);
    }

  };

  const passwordVisiblity = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword);

  };

  const handelconfirmPassword = (e) => {
    setConfirmPassword(e.target.value);

    if (e.target.value === password) {
      setMatchErr(false);
    } else {
      setMatchErr(true);
    }
  };

  const vaildatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
  }

  const checkUsernameAvailability = async (username) => {
    setUsername(username);

    if (username.trim() === '') {
      setUsernameAvailable(null);
      return;
    }



    try {
      const usernameRef = ref(database, 'users/' + username);
      const snapshot = await get(usernameRef);


      if (snapshot.exists()) {
        setUsernameAvailable(false);
        // setErrorMessage('Username is already taken.');
      } else {
        setUsernameAvailable(true);
        //  setErrorMessage('Username is avaiable.');
      }
    } catch (error) {
      setErrorMessage('Error checking username availability.');
      console.error(error);
    }
  };




  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-tl to-[#a2c0db] from-[#eab9da]'>



      <div className='flex bg-[#fff] min-w-[40vw] min-h-[30vw] justify-center rounded-2xl shadow-lg'>
        <div className='flex flex-col items-center justify-center'>
          <img src="../../login.svg" className='h-35 w-35 ' />
          <form action="" className='flex flex-col gap-3' onSubmit={formSubmit}>

            <p className='text-2xl font-semibold text-center'>Signup page</p>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => checkUsernameAvailability(e.target.value)}
              className='border-2 p-1.5 rounded-lg pr-10 border-gray-300 font-medium text-gray-700 focus:outline-none focus:border-gray-400 focus:text-gray-600 w-75'
            />

            <input
              type="email"

              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              className='border-2 p-1.5 rounded-lg w-full pr-10 border-gray-300 font-medium text-gray-700 focus:outline-none focus:border-gray-400 focus:text-gray-600 '
            />
            <input
              type="password"

              placeholder='Password'
              onChange={handlePasswordChange}
              className='border-2 p-1.5 rounded-lg w-full pr-10 border-gray-300 font-medium text-gray-700 focus:outline-none focus:border-gray-400 focus:text-gray-600 '
            />
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm Password'
                onChange={handelconfirmPassword}
                className='border-2 p-1.5 rounded-lg w-full pr-10 border-gray-300 font-medium text-gray-700 focus:outline-none focus:border-gray-400 focus:text-gray-600 '
              />
              <button
                type='button'
                onClick={passwordVisiblity}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <AiOutlineEye className="w-5 h-5 text-gray-600" />
                ) : (
                  <AiOutlineEyeInvisible className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {matchErr && <p className='text-red-500 text-sm'>Password do not match</p>}
            {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
            {accountCreated && <p className='text-green-700'>{accountCreated}</p>}
            {usernameAvailable === false && (
              <p className="text-red-500 text-sm">Username is already taken</p>
            )}
            {usernameAvailable === true && (
              <p className="text-green-600 text-sm">Username is available</p>
            )}

            <button type="submit"
              className='bg-[#2972e9] py-2 text-white px-4 rounded-full cursor-pointer'
            >
              Signup
            </button>

           
          </form>
           <p className='my-3'>Already Have account?<span className='text-[#4275f7] font-medium underline cursor-pointer'
            ><Link href='/'>Login</Link></span></p>
        </div>


        {/* <p>OR</p> */}
        {/* <button
          className='bg-[#fdfeff] py-2 border-2 border-[#ababab] px-4 flex rounded-full shadow-2xs cursor-pointer'
          onClick={handelGoogleLogin}
          disabled={loading}
        ><FcGoogle className='h-6 w-6 mr-2' /><span>Login with Google</span></button> */}


      </div>
    </div>
  )
}

export default Signup