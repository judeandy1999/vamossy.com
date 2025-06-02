'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Brand<span className="text-yellow-400">Name</span>
        </h1>
        <p className="mb-6 text-gray-600">Log in to continue</p>

        {/* Google Sign-in */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/create-article' })}
          className="flex items-center justify-center gap-2 rounded-sm border border-gray-300 shadow sm text-gray-600 px-4 py-2 rounded hover:bg-gray-100 hover:scale-101 transition-colors w-full mb-4"
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
