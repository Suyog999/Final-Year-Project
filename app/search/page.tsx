'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as React from 'react';
import '../../src/app/globals.css';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
function search() {
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const router = useRouter();

  const handleSubmit = () => {
    if (selectedCategory) {
      router.push(`/products?category_name=${selectedCategory}`);
    } else {
      alert('Please select a category first.');
    }
  }
    return <div>

            <nav>
                <div className='flex justify-between bg-slate-900 p-4'>
                    <div className='text-white text-2xl'>Predic</div>
                    <div className='flex space-x-4'>
                        <a href='/login' className='text-white '><Button className='bg-white text-black'>Login</Button></a>
                        <a href='/register' className='text-white'><Button className='bg-white text-black'>Register</Button></a>
                    </div>
                </div>
            </nav>
            <div className='flex flex-col justify-end items-center gap-3 h-[30rem]' >
                <div><p>Select the desired category</p></div>
                <div><p></p></div>
                <div>
                    <Select onValueChange={setSelectedCategory}> <SelectTrigger className="w-96">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="laptop">Laptop</SelectItem>
                            <SelectItem value="dairy milk">Dairy Milk</SelectItem>
                            <SelectItem value="makeup">Makeup</SelectItem>
                        </SelectContent></Select>
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        
    </div>
}

export default search;