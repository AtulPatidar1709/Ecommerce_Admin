'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

const Page = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [buttonDisable, setButtonDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await signIn('credentials', {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      // console.log("SignIn response:", response);

      if (response?.ok) {
        router.push('/');
        toast.success('Logged In Successfully');
      } else {
        toast.error(response?.error || 'Something Went Wrong');
      }
    } catch (error) {
      toast.error(
        'Something Went Wrong: ' + (error.message || 'Unknown error')
      );
      // console.error("Error in Frontend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisable(!(user.email.length > 0 && user.password.length > 0));
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
        callbackUrl: '/',
      });
    } catch (error) {
      toast.error('Failed to sign up with Google.');
      // console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center w-full bg-white">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-md p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Login</h1>
          <h2 className="font-inter font-semibold text-lg leading-6 text-center mb-2">
            Welcome back to ECOMMERCE.
          </h2>
          <p className="font-inter font-normal text-base leading-5 text-center mb-6">
            The next-gen business marketplace.
          </p>
        </div>
        <form onSubmit={onSignup} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-base font-semibold">
              Email
            </label>
            <input
              id="email"
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              type="email"
              placeholder="Enter your Email..."
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-base font-semibold">
              Password
            </label>
            <input
              id="password"
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              type="password"
              placeholder="Enter your Password..."
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-5 bg-black text-white rounded-md hover:bg-gray-800 mt-4"
            disabled={buttonDisable}
          >
            {buttonDisable ? 'Please Enter all Fields' : 'Log In'}
          </button>
        </form>
        <div className="w-full h-px bg-gray-300 my-4"></div>
        <p className="text-center text-base">
          <span className="font-inter font-normal">
            Don’t have an Account?{' '}
          </span>
          <Link
            href={'/sign-up'}
            className="text-black font-bold hover:underline"
          >
            SIGN UP
          </Link>
        </p>
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
