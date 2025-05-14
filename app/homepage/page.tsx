'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import '../../src/app/globals.css';
import { Button } from '@/components/ui/button';
import { LoginDialog } from "@/components/LoginDialog"
import { SignUpDialog } from "@/components/SignUpDialog"
import Link from "next/link"
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Example: Check if user token exists in localStorage
        const token = localStorage.getItem('userToken');
        if (token) setIsLoggedIn(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        router.replace('/homepage'); // Optional: navigate to homepage
    }

    return (
        <div className="h-screen w-full bg-[radial-gradient(ellipse_at_center,_#163060_0%,_#0b152d_40%,_#010314_70%)] flex items-center justify-center">
            <nav className='fixed w-full top-0 left-0 right-0 z-50'>
                <div className='flex justify-between p-4'>
                    <div className='text-white text-2xl'>Predic</div>
                    <div className='flex space-x-4'>
                        {isLoggedIn ? (
                            <Button onClick={handleLogout} className='bg-red-600 hover:bg-red-700'>Logout</Button>
                        ) : (
                            <>
                                <LoginDialog />
                                <SignUpDialog />
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <div className='flex flex-col z-50 justify-center items-center gap-3 h-[35rem]' >
                <div className='z-50'><p className='text-4xl md:text-5xl font-bold text-sky-400 text-center drop-shadow-md'>Inflation Insights Instantly</p></div>
                <div className='z-50'><p className='text-slate-300 text-center text-lg mt-4 '>Smarter Planning with Predictive AI.</p></div>
                <div className='flex flex-row gap-3 z-50'>
                    <div><Link href='/search'><Button className='bg-teal-600 hover:bg-teal-700'>Get Started</Button></Link></div>
                </div>
            </div>
        </div>
    )
}
