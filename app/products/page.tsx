'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '../../src/app/globals.css';

type Product = {
  product_name: string;
  image: string;
  latest_price: number;
  description: string;
};

function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  console.log('Category:', category);
  useEffect(() => {
    const queryCategory = new URLSearchParams(window.location.search).get('category_name');
    setCategory(queryCategory || '');

    if (queryCategory) {
      axios
        .get(`http://127.0.0.1:8089/api/products/?category_name=${queryCategory}`)
        .then(res => {
          setProducts(res.data);
        })
        .catch(err => console.error('API error:', err));
    }
  }, []);

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Products: {category}</h1>

      <div className="space-y-8">
        {products.map((product, index) => (
          <Link
            key={index}
            href={`/product?product_name=${product.product_name}`}
            className="block"
          >
            <div className="flex border border-gray-300 rounded-md p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="w-[200px] flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-full h-[180px] object-contain"
                />
              </div>

              {/* Details */}
              <div className="ml-6 flex flex-col justify-between w-full">
                <h2 className="text-xl font-bold">{product.product_name}</h2>

                <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                  {product.description.split(',').map((desc, idx) => (
                    <li key={idx}>{desc.trim()}</li>
                  ))}
                </ul>

                <div className="mt-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-semibold text-green-700">
                      ₹{product.latest_price.toLocaleString()}
                    </span>
                    <span className="line-through text-gray-500 text-sm">
                      ₹{Math.round(product.latest_price * 1.25).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>Free delivery</p>
                    <p className="text-green-700">Bank Offer</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
