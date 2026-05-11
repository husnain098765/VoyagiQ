// src/app/login/page.jsx
"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react'; //  NextAuth ka main function
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered') === 'true'; // Registration success message ke liye
    const callbackUrl = searchParams.get('callbackUrl') || '/'; // Redirect URL agar Save Trip se aaye hain

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        //  NextAuth signIn function ko call karein
        const result = await signIn('credentials', {
            redirect: false, // Redirect ko manual control karein
            email,
            password,
            callbackUrl: callbackUrl, // User ko wapas uske original page par bhej dein
        });

        if (result.error) {
            setError('Invalid email or password.');
        } else {
            // Success, redirect to the callbackUrl
            router.push(result.url || '/'); 
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-indigo-700">Welcome Back</h2>
                
                {registered && <p className="text-green-600 font-semibold text-center">Registration successful! Please log in.</p>}
                {error && <p className="text-red-600 font-medium text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center text-sm">
                    Don't have an account? <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register now</Link>
                </div>
            </div>
        </div>
    );
}