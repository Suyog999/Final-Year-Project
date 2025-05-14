

// 'use client';

// import * as React from 'react';
// import { useRouter } from 'next/navigation';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import '../../src/app/globals.css';

// const Search = () => {
//   const [selectedCategory, setSelectedCategory] = React.useState('');
//   const router = useRouter();

//   const handleSubmit = () => {
//     if (selectedCategory) {
//       router.push(`/products?category_name=${selectedCategory}`);
//     } else {
//       alert('Please select a category first.');
//     }
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navigation Bar */}
//       <nav className="bg-slate-900 p-4">
//         <div className="flex justify-between items-center">
//           <div className="text-white text-3xl font-medium">Predict</div>
//           <div className="flex space-x-2">
//             <a href="/login" className="text-black">
//               <button className="bg-white hover:bg-gray-100 py-2 px-4 rounded">
//                 login
//               </button>
//             </a>
//             <a href="/register" className="text-black">
//               <button className="bg-white hover:bg-gray-100 py-2 px-4 rounded">
//                 Register
//               </button>
//             </a>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content Area */}
//       <div className="flex-grow flex flex-col items-center justify-center py-16">
//         <h2 className="text-blue-500 text-2xl mb-6">Select the desired category</h2>
        
//         <Select onValueChange={setSelectedCategory}>
//           <SelectTrigger className="w-96 mb-6">
//             <SelectValue placeholder="Select Category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="laptop">Laptop</SelectItem>
//             <SelectItem value="dairy milk">Dairy Milk</SelectItem>
//             <SelectItem value="makeup">Makeup</SelectItem>
//           </SelectContent>
//         </Select>
        
//         <Button 
//           onClick={handleSubmit}
//           className="w-96 bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded"
//         >
//           Submit
//         </Button>
//       </div>

//       {/* Features Section */}
//       <div className="bg-gray-100 py-16">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Card 1 */}
//             <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
//               <div className="mb-4">
//                 <img src="/api/placeholder/100/100" alt="Shopping Cart" className="h-16 w-16" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">Explore Item Categories</h3>
//               <p className="text-gray-600">
//                 Dive into different product categories to see how their prices changed over time
//               </p>
//             </div>
            
//             {/* Card 2 */}
//             <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
//               <div className="mb-4">
//                 <img src="/api/placeholder/100/100" alt="Hourglass" className="h-16 w-16" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">Track Price Timeline</h3>
//               <p className="text-gray-600">
//                 Select a time range to follow the historical pricing trends of any item
//               </p>
//             </div>
            
//             {/* Card 3 */}
//             <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
//               <div className="mb-4">
//                 <img src="/api/placeholder/100/100" alt="Globe" className="h-16 w-16" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">Compare by Location</h3>
//               <p className="text-gray-600">
//                 Discover how prices differed across various locations and regions
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Search;
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import '../../src/app/globals.css';
import { LoginDialog } from '@/components/LoginDialog';
import { SignUpDialog } from '@/components/SignUpDialog';
import axios from 'axios';

const Search = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [categories, setCategories] = React.useState<any[]>([]); // State to hold categories (array of objects)
  const [token, setToken] = React.useState<string | null>(null);
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  // Fetch categories on component mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    setToken(storedToken);

    // Fetch categories from the API (you can replace the URL with your own API endpoint)
    axios
      .get('http://127.0.0.1:8089/api/categories') // Replace with your endpoint
      .then((response) => {
        setCategories(response.data); // Assuming the API returns an array of category objects
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = () => {
    if (!token) {
      setShowLoginDialog(true);
    }
    
    if (selectedCategory) {
      console.log('Selected Category:', selectedCategory);
      router.push(`/products?category_name=${selectedCategory}`);
    } else {
      alert('Please select a category first.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userData');
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 p-4">
        <div className="flex justify-between items-center">
          <div className="text-white text-3xl font-medium">Predict</div>
          <div className="flex space-x-2">
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-gray-100 py-2 px-4 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <LoginDialog />
                <SignUpDialog />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center py-16">
        <h2 className="text-blue-500 text-2xl mb-6">Select the desired category</h2>

        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-96 mb-6">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.length > 0 ? (
              categories.map((category, idx) => (
                <SelectItem key={idx} value={category.category_name}>
                  {category.category_name} {/* Render category_name instead of the whole object */}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-categories">No categories available</SelectItem>
            )}
          </SelectContent>
        </Select>

        <Button
          onClick={handleSubmit}
          className="w-96 bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded"
        >
          Submit
        </Button>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="mb-4">
                <img src="card1.png" alt="Shopping Cart" className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Explore Item Categories</h3>
              <p className="text-gray-600">
                Dive into different product categories to see how their prices changed over time
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="mb-4">
                <img src="card2.png" alt="Hourglass" className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Track Price Timeline</h3>
              <p className="text-gray-600">
                Select a time range to follow the historical pricing trends of any item
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="mb-4">
                <img src="card3.png" alt="Globe" className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Compare by Location</h3>
              <p className="text-gray-600">
                Discover how prices differed across various locations and regions
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Login Dialog (controlled) */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
};

export default Search;
