// app/products/layout.tsx (or wherever your route is)

import React from 'react';

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {children}
    </div>
  );
}
  