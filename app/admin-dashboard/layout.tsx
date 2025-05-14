// app/products/layout.tsx
import { AppSidebar } from '@/components/appsidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React, { Suspense } from 'react';


export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
      <div>
        <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>

      </div>
      

  );
}
