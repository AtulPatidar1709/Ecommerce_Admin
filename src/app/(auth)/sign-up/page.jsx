'use client';

import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const Page = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [buttonDisable, setButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/sign-up', user);
      if (response.status === 201) {
        toast.success('User Registered Successfully');
        router.push(`/sign-in`);
      } else {
        toast.error(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
  };

  useEffect(() => {
    if (
      user.email.length > 6 &&
      user.password.length > 3 &&
      user.name.length > 3
    ) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-inter font-semibold">Loading...</p>
      </div>
    );
  }

  const signupGoogle = async () => {
    try {
      const googleData = await signIn('google', {
        callbackUrl: '/profile',
      });
      // console.log("Google sign-in response:", googleData);
    } catch (error) {
      toast.error('Failed to sign up with Google.');
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center h-screen bg-white">
      <div className=" w-full sm:w-3/4 md:w-2/3 lg:w-1/3 xl:w-1/4  p-4 mx-auto rounded-lg border border-gray-300 bg-white shadow-lg ">
        <form
          onSubmit={onSignup}
          className="flex flex-col w-full gap-4 px-4 sm:px-6 md:px-8 lg:px-10"
        >
          <h1 className="text-lg sm:text-xl lg:text-2xl lg:py-4 font-bold text-center leading-tight">
            Create your account
          </h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              type="text"
              placeholder="Enter your Name..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              type="email"
              placeholder="Enter your Email..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              type="password"
              placeholder="Enter your Password..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-5 bg-black text-white rounded-md hover:bg-gray-800"
            disabled={buttonDisable} // Disable button based on buttonDisable state
          >
            {buttonDisable ? 'Please Fill Details' : 'CREATE ACCOUNT'}
          </button>
          <p className="text-center pt-6 text-sm sm:text-base">
            <span className="font-normal">Have an Account? </span>
            <Link
              href={'/sign-in'}
              className="text-black font-bold hover:underline"
            >
              LOGIN
            </Link>
          </p>
        </form>
        <div className="flex items-center justify-center">
          <button
            onClick={signupGoogle}
            className="bg-black text-white flex gap-4 p-3 justify-center items-center"
          >
            <span>Sign Up using</span>
            <FcGoogle height={20} width={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
