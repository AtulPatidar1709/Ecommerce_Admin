'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ClientLayout({ children }) {
  const pathname = usePathname(); // Get the current pathname

  // Check if the current page is "sign-in" or "sign-up"
  const showHeader = pathname !== '/sign-in' && pathname !== '/sign-up';

  return (
    <>
      {showHeader ? (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100">
          {/* Header for larger screens */}
          <div className="w-full lg:w-1/4 xl:w-1/5 bg-gray-400 p-4 lg:min-h-screen">
            <Header />
          </div>

          {/* Main content area */}
          <div className="w-full lg:w-3/4 xl:w-4/5 p-4 bg-white min-h-screen rounded-tl-lg shadow-lg">
            {children}
          </div>
        </div>
      ) : (
        // Full-width layout for "sign-in" and "sign-up" pages
        <div className="w-full min-h-screen flex items-center justify-center p-4">
          {children}
        </div>
      )}
    </>
  );
}
