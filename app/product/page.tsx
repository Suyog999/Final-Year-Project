"use client";
import '../../src/app/globals.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
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
import { Button } from '@/components/ui/button';

interface Review {
  review: string;
}

interface PriceEntry {
  price_date: string;
  price: string;
  id?: number;
}

type ProductData = {
  product_name: string;
  description: Record<string, any> | string;
  image: string;
  latest_price: string;
  category?: string;
  reviews?: Review[];
  prices?: PriceEntry[];
};

const ProductPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productName = searchParams.get("product_name");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [lstmPrediction, setLstmPrediction] = useState<number | null>(null);
  const [sentimentPredictions, setSentimentPredictions] = useState<any[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllDescription, setShowAllDescription] = useState(false);

  const parseAndFlattenDescription = (): { key: string; value: string }[] => {
    if (!productData?.description) return [];

    let parsed: Record<string, any>;
    try {
      parsed = typeof productData.description === "string"
        ? JSON.parse(productData.description)
        : productData.description;
    } catch {
      return [];
    }

    const flatten = (obj: any, prefix = ""): { key: string; value: string }[] => {
      return Object.entries(obj).flatMap(([key, value]) => {
        const prefixedKey = prefix ? `${prefix} → ${key}` : key;
        if (typeof value === "object" && value !== null) {
          return flatten(value, prefixedKey);
        } else {
          return [{ key: prefixedKey, value: String(value) }];
        }
      });
    };

    return flatten(parsed);
  };

  const renderDescription = () => {
    const flattened = parseAndFlattenDescription();
    const itemsToShow = showAllDescription ? flattened : flattened.slice(0, 10);

    return (
      <div className="bg-white p-4 rounded-md shadow-sm mt-4 text-base">
        <h3 className="text-lg font-semibold mb-4">Product Description</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {itemsToShow.map((item, index) => (
            <li key={index}>
              <strong>{item.key}:</strong> {item.value}
            </li>
          ))}
        </ul>
        {flattened.length > 10 && (
          <button
            onClick={() => setShowAllDescription(!showAllDescription)}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            {showAllDescription ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    );
  };

  const handleEmailClick = () => {
    const emailMessage = `You will be notified when the price reaches ₹${lstmPrediction}.`;
    alert(emailMessage);  // Display alert message with price
  };

  useEffect(() => {
    if (!productName) return;

    // Fetch product data
    axios
      .get(`http://127.0.0.1:8089/api/product?product_name=${productName}`)
      .then((res) => {
        if (res.data && typeof res.data === "object") {
          setProductData(res.data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));

    // Fetch LSTM prediction
    axios
      .get(`http://127.0.0.1:8089/api/predict/lstm/?product_name=${productName}`)
      .then((res) => setLstmPrediction(res.data?.predicted_price))
      .catch((err) => console.error("LSTM prediction error:", err));

    // Fetch sentiment-based predictions
    axios
      .get(`http://127.0.0.1:8089/api/predict/sentiment/?product_name=${productName}`)
      .then((res) => setSentimentPredictions(res.data?.review_predictions || []))
      .catch((err) => console.error("Sentiment prediction error:", err));
  }, [productName]);

  const renderReviews = () => {
    const reviewsToShow = showAllReviews ? productData?.reviews : productData?.reviews?.slice(0, 7);
    const hasMoreReviews = productData?.reviews && productData.reviews.length > 7;

    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold mb-4">User Review ★★★★★</h3>
        {reviewsToShow?.length ? (
          <>
            <div className="space-y-2">
              {reviewsToShow.map((rev, idx) => (
                <div key={idx} className="text-gray-700 text-sm">
                  {rev.review}
                </div>
              ))}
            </div>
            {hasMoreReviews && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                {showAllReviews ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    );
  };

  const renderPriceTable = () => {
    const pricesToShow = showAllPrices ? productData?.prices : productData?.prices?.slice(0, 5);
    const hasMorePrices = productData?.prices && productData.prices.length > 5;

    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Price History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-blue-700 text-white text-left">S.No.</th>
                <th className="py-2 px-4 bg-blue-700 text-white text-left">Date</th>
                <th className="py-2 px-4 bg-blue-700 text-white text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {pricesToShow?.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{entry.price_date}</td>
                  <td className="py-2 px-4">{entry.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasMorePrices && (
            <button
              onClick={() => setShowAllPrices(!showAllPrices)}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              {showAllPrices ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!productData) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4 bg-gray-100">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-blue-500 bg-gray-50 px-4 py-1 rounded border border-blue-300"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={productData.image}
              alt={productData.product_name}
              className="w-full object-contain rounded"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h1 className="text-lg font-medium text-gray-900 mb-1">{productData.product_name}</h1>
            <div className="text-red-500 font-medium mb-4">RS. {productData.latest_price}</div>
            {renderDescription()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 px-4">
        <div>{renderReviews()}</div>
        <div className="bg-slate-800 text-white p-4 rounded-md w-full">
          <div className="mb-2">
            <div>Predicted Future Price</div>
            <div className="text-2xl font-bold">
              {sentimentPredictions.length > 0 ? `Rs. ${sentimentPredictions[0].predicted_price}` : "Loading..."}
            </div>
          </div>
          <BarChart width={800} height={200} data={sentimentPredictions} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="review_date" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }} />
            <Bar dataKey="predicted_price" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div className="px-4 mb-4">{renderPriceTable()}</div>

      <div className="px-4 mb-4 flex justify-center">
        <div className="bg-slate-800 text-white p-4 rounded-md w-full">
          <h3 className="text-lg font-semibold mb-2 text-center">Laptop Price Predicted(`Rs. {lstmPrediction}`) </h3>
          <div className="flex justify-center">
            <LineChart
              width={1000}
              height={200}
              data={productData.prices?.map((p) => ({
                month: p.price_date,
                price: Number(p.price),
              })) || []}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="month" tick={{ fill: 'white' }} />
              <YAxis tick={{ fill: 'white' }} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4ade80"
                strokeWidth={2}
                dot={{ r: 4, fill: "#4ade80" }}
              />
            </LineChart>
          </div>
          <Button 
            onClick={handleEmailClick}
            className='ml-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition'
          >
            Email
          </Button>
        </div>
      </div>

    </div>
  );
};

export default ProductPage;
