import React, { useState } from 'react';
import '../../src/app/globals.css';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { auth } from '../../firebase';
import { useRouter } from "next/router";
import Image from 'next/image';

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
        setErrorMessage('Enter your email and password correctly');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-tl to-[#a2c0db] from-[#eab9da] px-4'>
      <div className='w-full max-w-md bg-white p-6 md:p-10 rounded-2xl shadow-lg'>
        <div className='w-full'>
          <div className='flex justify-center '>
            <Image src="/login.svg" alt="Login Illustration" width={150} height={150} className='' />
          </div>

          <p className='text-2xl text-center font-semibold text-[#1a1a1a] '>Login Page</p>

          <form onSubmit={handleFormSubmit} className='flex flex-col '>
            <div className="flex justify-center m-2 w-full max-w-sm mx-auto ">
              <input
                type="email"
                placeholder="Email"
                className="border-2 p-2 rounded-lg w-full border-gray-300 font-medium text-[#262626] focus:outline-none focus:border-[#414141] "
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative m-2 w-full max-w-sm mx-auto">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="border-2 p-2 rounded-lg w-full border-gray-300 font-medium text-[#262626] focus:outline-none focus:border-[#414141] "
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={passwordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <AiOutlineEye className="w-5 h-5 text-gray-600" />
                ) : (
                  <AiOutlineEyeInvisible className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>


            {errorMessage && <p className='text-red-500 text-sm  mt-1'>{errorMessage}</p>}
            {successMessage && <p className='text-green-600 text-sm  mt-1'>{successMessage}</p>}
 
            <button
              type="submit"
              className='bg-[#2972e9] w-full max-w-sm mx-auto py-2 text-white px-4 rounded-full m-2 hover:bg-[#225dcc] transition-colors'
            >
              Login
            </button>
          </form>

          <p className='text-center mt-4 text-[#1a1a1a] text-sm'>
            Don&apos;t have an account?{' '}
            <Link href='/auth/signup' className='text-[#4275f7] font-medium underline'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
