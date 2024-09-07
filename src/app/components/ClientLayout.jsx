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
        <div className="bg-gray-400 w-full min-h-screen flex">
          <Header />
          <div className="w-full rounded-tl-lg p-3 mr-2 mt-2 min-h-screen pt-4 bg-white">
            {children}
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
}
