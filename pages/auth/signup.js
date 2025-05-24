import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import '../../src/app/globals.css';

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, database } from '../../firebase';
import { ref, get } from 'firebase/database';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchErr, setMatchErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState('');
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Password must contain at least one special character.";
    return null;
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    setMatchErr(confirmPassword && value !== confirmPassword);
  };

  const passwordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setMatchErr(value !== password);
  };



  const formSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setAccountCreated('');
    setLoading(true);

    const passwordError = validatePassword(password);

    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill out all the fields');
      setLoading(false);
      return;
    }

    if (passwordError) {
      setErrorMessage(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMatchErr(true);
      setErrorMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // setAccountCreated('Account created successfully');

      router.push({
        pathname: '/userInfo',
        query: {
          email: email,
          uid: user.uid,
        },
      });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Email already exists');
      } else {
        setErrorMessage('Failed to create account');
      }
      setAccountCreated('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-tl to-[#a2c0db] from-[#eab9da] px-4'>
      <div className='w-full max-w-md bg-white p-6 md:p-10 rounded-2xl shadow-lg'>
        <div className='flex flex-col items-center'>
          <Image src="/login.svg" alt="Signup Illustration" width={150} height={150} />
          <p className='text-2xl text-[#1a1a1a] font-semibold text-center mt-2'>Signup Page</p>

          <form onSubmit={formSubmit} className='flex flex-col gap-3 w-full mt-4'>

            <input
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border-2 p-2 rounded-lg w-full border-gray-300 font-medium text-[#262626] focus:outline-none focus:border-[#414141]'
            />

            <input
              type="password"
              placeholder='Password'
              onChange={handlePasswordChange}
              className='border-2 p-2 rounded-lg w-full border-gray-300 font-medium text-[#262626] focus:outline-none focus:border-[#414141]'
            />

            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm Password'
                onChange={handleConfirmPassword}
                className='border-2 p-2 rounded-lg w-full border-gray-300 font-medium text-[#262626] focus:outline-none focus:border-[#414141]'
              />
              <button
                type='button'
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

            {matchErr && <p className='text-red-500 text-sm'>Passwords do not match</p>}
            {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
            {accountCreated && <p className='text-green-700'>{accountCreated}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`bg-[#2972e9] py-2 text-white px-4 rounded-full w-full hover:bg-[#225dcc] transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Signup'}
            </button>
          </form>

          <p className='text-sm text-[#1a1a1a] mt-4'>
            Already have an account?{' '}
            <Link href='/' className='text-[#4275f7] font-medium underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
