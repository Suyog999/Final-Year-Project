// 'use client';
// import '../../src/app/globals.css';
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import axios from 'axios';

// type ProductData = {
//   product_name: string;
//   description: Record<string, any> | string;
//   image: string;
//   latest_price: string;
//   category?: string;
//   reviews?: { review: string }[];
//   prices?: { price: string; price_date: string }[];
// };

// export default function ProductPage() {
//   const searchParams = useSearchParams();
//   const productName = searchParams.get('product_name');
//   const [productData, setProductData] = useState<ProductData | null>(null);

//   useEffect(() => {
//     if (productName) {
//       axios
//         .get(`http://127.0.0.1:8089/api/product?product_name=${productName}`)
//         .then(res => setProductData(res.data))
//         .catch(err => console.error('Fetch error:', err));
//     }
//   }, [productName]);

//   const renderDescription = (description: any) => {
//     try {
//       const parsed = typeof description === 'string' ? JSON.parse(description) : description;
//       return (
//         <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
//           {Object.entries(parsed).map(([key, val], idx) => (
//             <li key={idx}>
//               <span className="font-medium">{key}:</span> {String(val)}
//             </li>
//           ))}
//         </ul>
//       );
//     } catch {
//       return <p className="text-sm text-gray-700">{String(description)}</p>;
//     }
//   };

//   const renderReviews = (reviews?: { review: string }[]) => {
//     if (!reviews || reviews.length === 0) return null;
//     return (
//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
//         <div className="grid gap-3">
//           {reviews.map((r, idx) => (
//             <div
//               key={idx}
//               className="border border-gray-300 rounded-md p-3 text-sm bg-white shadow-sm"
//             >
//               {r.review}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderPriceTable = (prices?: { price: string; price_date: string }[]) => {
//     if (!prices || prices.length === 0) return null;
//     return (
//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">Price History</h2>
//         <table className="w-full text-sm border border-gray-300 shadow-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border-b">Date</th>
//               <th className="p-2 border-b">Price (₹)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {prices.map((entry, idx) => (
//               <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                 <td className="p-2 border-b">{entry.price_date}</td>
//                 <td className="p-2 border-b">₹{entry.price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full px-6 py-10 max-w-7xl mx-auto">
//       {/* Top Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         {/* Image */}
//         <div className="flex justify-center items-start">
//           <img
//             src={productData?.image}
//             alt={productData?.product_name}
//             className="max-w-md w-full rounded-lg border shadow"
//           />
//         </div>

//         {/* Product Details */}
//         <div className="space-y-4">
//           <h1 className="text-2xl font-bold text-gray-900">{productData?.product_name}</h1>
//           {productData?.category && <p className="text-sm text-gray-500">{productData.category}</p>}
//           <div className="text-green-600 text-sm font-semibold flex items-center gap-2">
//             <span>4.5 ★</span>
//             <span className="text-gray-500">(267 Ratings & 20 Reviews)</span>
//           </div>
//           <div className="text-3xl font-bold text-orange-600">₹{productData?.latest_price}</div>
//           <div>{productData?.description && renderDescription(productData.description)}</div>
//           <div className="space-y-1 text-sm">
//             <p className="text-green-700 font-medium">✓ Special Price</p>
//             <p className="text-green-700 font-medium">✓ Bank Offer</p>
//             <p className="text-green-700 font-medium">✓ Combo Offer</p>
//           </div>
//           <div className="flex gap-4 pt-4">
//             <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded font-semibold shadow">
//               Add to Cart
//             </button>
//             <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold shadow">
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section: Reviews and Price Table */}
//       <div className="mt-12">
//         {renderReviews(productData?.reviews)}
//         {renderPriceTable(productData?.prices)}
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface Review {
  review: string;
}

interface PriceEntry {
  price_date: string;
  price: string;
}

interface ProductData {
  product_name: string;
  product_image_link: string;
  product_price: string;
  product_rating: string;
  reviews: Review[];
  price_history: PriceEntry[];
}

const ProductPage: React.FC = () => {
  const searchParams = useSearchParams();
  const productName = searchParams.get("product_name");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [lstmPrediction, setLstmPrediction] = useState<number | null>(null);
  const [sentimentPredictions, setSentimentPredictions] = useState<any[]>([]);

  useEffect(() => {
    if (!productName) return;

    axios
      .get(`http://127.0.0.1:8089/api/product?product_name=${productName}`)
      .then((res) => setProductData(res.data))
      .catch((err) => console.error("Fetch error:", err));

    axios
      .get(`http://127.0.0.1:8089/api/predict/lstm/?product_name=${productName}`)
      .then((res) => setLstmPrediction(res.data.predicted_price))
      .catch((err) => console.error("LSTM prediction error:", err));

    axios
      .get(`http://127.0.0.1:8089/api/predict/sentiment/?product_name=${productName}`)
      .then((res) => setSentimentPredictions(res.data.review_predictions))
      .catch((err) => console.error("Sentiment prediction error:", err));
  }, [productName]);

  if (!productData) return <div>Loading...</div>;

  const renderReviews = () => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">User Reviews</h3>
      <div className="grid grid-cols-1 gap-2">
        {productData.reviews.map((rev, idx) => (
          <div key={idx} className="border p-2 rounded bg-white">
            {rev.review}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPriceTable = () => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Price History</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {productData.price_history.map((entry, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{entry.price_date}</td>
                <td className="border px-4 py-2">₹{entry.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={productData.product_image_link}
            alt={productData.product_name}
            className="w-full object-contain rounded"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{productData.product_name}</h1>
          <p className="text-xl text-green-600 font-semibold mb-2">
            ₹{productData.product_price}
          </p>
          <p className="text-md text-yellow-600 mb-4">
            Rating: {productData.product_rating} ★
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Add to Cart
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <div className="w-full lg:w-1/2">
          {renderReviews()}
        </div>
        <div className="w-full lg:w-1/2">
          {sentimentPredictions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Review-Based Price Predictions</h3>
              <BarChart width={500} height={300} data={sentimentPredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="review_date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="predicted_price" fill="#8884d8" />
              </BarChart>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <div className="w-full lg:w-1/2">
          {renderPriceTable()}
        </div>
        <div className="w-full lg:w-1/2">
          {lstmPrediction !== null && (
            <div>
              <h3 className="text-lg font-semibold mb-2">LSTM Predicted Price</h3>
              <LineChart width={500} height={300} data={[{ name: "Prediction", price: lstmPrediction }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
