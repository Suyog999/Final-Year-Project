// app/products/layout.tsx
import React, { Suspense } from 'react';
import Loading from './loading'; // You can create a loading.tsx component here

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
