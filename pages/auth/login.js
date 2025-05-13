import React, { useState } from 'react'
import '../../src/app/globals.css'
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { auth } from '../../firebase';
import { useRouter } from "next/router";

// import { FcGoogle } from 'react-icons/fc';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const passwordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setErrorMessage('');
      setSuccessMessage('User logged in successfully');
      router.push('/homepage');

    } catch (err) {
      console.log(err);
      if (err.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email. Please sign up.');
      } else if (err.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-credential') {
        setErrorMessage('Enter you email and password correctly');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      setSuccessMessage('');
    }
  };

  // const provider = new GoogleAuthProvider();
  // const handleGoogleLogin = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     console.log(`${user.email} logged in successfully`);
  //   } catch (err) {
  //     console.log(err);
  //     setErrorMessage('Google login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-tl to-[#a2c0db] from-[#eab9da] '>

      <div className=' flex bg-[#fff] min-w-[40vw] min-h-[28vw] justify-center rounded-2xl shadow-lg'>

        <div className='flex flex-col items-center justify-center '>
          
            <img src="login.svg" className='h-35 w-35 mt-[-30px]' />
          <p className='text-2xl font-semibold m-2'>Login page</p>
       
          
          <form action="" className='flex flex-col'
            onSubmit={handleFormSubmit}
          >

            <input
              type="email"
              placeholder='Email'
              className='border-2 p-1.5 rounded-lg w-full pr-10 border-gray-300 font-medium text-gray-700 focus:outline-none focus:border-gray-400 focus:text-gray-600 m-2'
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative w-75">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="border-2 p-1.5 rounded-lg w-full pr-10 border-gray-300 font-medium text-gray-700 focus:outline-none focus:border-gray-400 focus:text-gray-600 m-2"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type='button'
                onClick={passwordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <AiOutlineEye className="w-5 h-5 text-gray-600" />
                ) : (
                  <AiOutlineEyeInvisible className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
            {successMessage && <p className='text-green-700'>{successMessage}</p>}

            <button type="submit"
              className='bg-[#2972e9] py-2 text-white px-4 rounded-full cursor-pointer m-2'
            >
              Login
            </button>
          </form>
          {/* <p>OR</p>
          <button
            className='bg-[#fdfeff] py-2 border-2 border-[#ababab] px-4 flex rounded-full shadow-2xs cursor-pointer'
            onClick={handleGoogleLogin}
            disabled={loading}
          ><FcGoogle className='h-6 w-6 mr-2' /><span>Login with Google</span></button> */}
          <p className='my-3'>Don&apos;t Have account?<span className='text-[#4275f7] font-medium underline cursor-pointer'>
            <Link href='/auth/signup'>SignUp</Link></span></p>
        </div>
      </div>


    </div>
  )
}

export default Login