import * as React from 'react';
import '../../src/app/globals.css';
import { Button } from '@/components/ui/button';
import Link from "next/link"
export default function HomePage() {
    return (
        <div className="h-screen w-full bg-[radial-gradient(ellipse_at_center,_#163060_0%,_#0b152d_40%,_#010314_70%)] flex items-center justify-center">
    {/* // <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0b0f2b] to-[#0a58ca] overflow-hidden">
    //     <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-blue-700 opacity-40 blur-[150px] rounded-full"></div> */}
              {/* <div className="absolute inset-0 z-0 pointer-events-none"><AuroraBackground className="absolute inset-0 z-0 opacity-1 bg-slate-950 pointer-events-none"><></></AuroraBackground></div> */}
            <nav className='fixed w-full top-0 left-0 right-0 z-50'>
                    <div className='flex justify-between p-4'>
                        <div className='text-white text-2xl'>Predic</div>
                        <div className='flex space-x-4'>
                            <a href='/login' className='text-white '><Button className='bg-white text-black'>Login</Button></a>
                            <a href='/register' className='text-white'><Button className='bg-white text-black'>Register</Button></a>

                        </div>
                    </div>
                </nav>
                <div className='flex flex-col z-50 justify-end items-center gap-3 h-[35rem]' >
                    <div className='z-50'><p className='text-7xl tracking-tight bg-clip-text  bg-gradient-to-r from-cyan-50 via-slate-300 to-slate-400'>Future Is Here</p></div>
                    <div className='z-50'><p className='text-5xl tracking-tight bg-clip-text bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300'>Your AI Driven Answer For Inflation</p></div>
                    <div className='flex flex-row gap-3 z-50'>
                        <div><Link href='/search'><Button className='bg-cyan-900 text-cyan-50'>Get Started</Button></Link></div>
                        <div><Button>About Us</Button></div>
                    </div>
                </div>
        </div>
        
    )
    
    }