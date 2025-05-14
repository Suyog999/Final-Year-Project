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
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

const toggleExpanded = (index: number) => {
  setExpandedIndices(prev => {
    const updated = new Set(prev);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    return updated;
  });
};

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
      <h1 className="text-3xl font-bold mb-6 items-center text-center text-slate-900">Showing Results for: {category.toUpperCase()}</h1>

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
  {(() => {
    try {
      const parsedDesc = JSON.parse(product.description);

      if (parsedDesc && typeof parsedDesc === 'object') {
        const entries = Object.entries(parsedDesc).flatMap(([section, details]) =>
          typeof details === 'object' && details !== null
            ? [
                <li key={section} className="font-semibold mt-2">{section}:</li>,
                ...Object.entries(details).map(([key, value], i) => (
                  <li key={`${section}-${i}`} className="ml-4">
                    {key}: {String(value)}
                  </li>
                ))
              ]
            : [
                <li key={section}>
                  {section}: {String(details)}
                </li>
              ]
        );

        const isExpanded = expandedIndices.has(index);
        const visibleEntries = isExpanded ? entries : entries.slice(0, 5); // Show only 5 items by default

        return (
          <>
            {visibleEntries}
            {entries.length > 5 && (
              <button
                className="text-blue-600 mt-2 ml-1 text-sm hover:underline"
                onClick={() => toggleExpanded(index)}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </>
        );
      } else {
        return [<li key="invalid">Invalid description format</li>];
      }
    } catch (e) {
      return product.description
        .split(',')
        .slice(0, 5)
        .map((desc, idx) => <li key={idx}>{desc.trim()}</li>)
        .concat(
          product.description.split(',').length > 5 ? (
            <button
              className="text-blue-600 mt-2 ml-1 text-sm hover:underline"
              onClick={() => toggleExpanded(index)}
            >
              Show More
            </button>
          ) : []
        );
    }
  })()}
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
