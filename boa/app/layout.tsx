import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bank of America | Log In | Online Banking",
  description: "Log In to Online Banking",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#333]">
        {/* BEGIN: Top Disclaimer Bar */}
        <div className="bg-[#f0f0f0] text-[10px] text-gray-600 py-1 text-center border-b border-gray-300" data-purpose="top-disclaimer">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
            <span className="flex items-center">
              <img
                alt="FDIC"
                className="h-3 mx-1"
                src="/global-fdic-fdic-digital-sign-CSX37f66a3e.svg"
              />
            </span>
          </div>
        </div>
        {/* END: Top Disclaimer Bar */}

        {/* BEGIN: MainHeader */}
        <header className="px-4 py-3 md:py-4 flex justify-between items-center max-w-5xl mx-auto" data-purpose="main-header">
          <div className="flex items-center space-x-4">
            <img alt="Bank of America Logo" className="h-5 md:h-7" src="/BofA_rgb.png" />
            <span className="text-gray-500 text-lg md:text-xl font-light border-l border-gray-300 pl-4 hidden sm:block">Log In</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-700">
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path>
              </svg>
              <span className="font-bold">Secure Area</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <a className="text-boa-blue hover:underline hidden sm:inline" href="#">En español</a>
          </div>
        </header>
        {/* END: MainHeader */}

        {/* MAIN */}
        {children}

        {/* BEGIN: Footer */}
        <footer className="bg-[#f2f0eb] mt-12 py-8 px-4 md:px-8 border-t border-gray-200" data-purpose="footer">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center text-sm font-bold text-gray-600 mb-6">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path>
              </svg>
              Secure area
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-3 text-xs md:text-sm text-boa-blue mb-6">
              <a className="hover:underline" href="#">Privacy</a>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <a className="hover:underline" href="#">Security</a>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <a className="hover:underline flex items-center" href="#">
                Your Privacy Choices
                <span className="ml-1 bg-boa-blue text-white text-[8px] px-1 py-0.5 rounded-sm leading-tight inline-flex items-center">
                  <span className="mr-0.5">✔</span> X
                </span>
              </a>
            </div>
            <div className="text-[11px] md:text-xs text-gray-600 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <span>Bank of America, N.A. Member FDIC. </span>
                <span className="flex items-center">
                  <a className="sm:ml-1 text-boa-blue hover:underline" href="#">Equal Housing Lender</a>
                  <svg className="h-3 w-3 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2l6 4.5V19h-3v-5H9v5H6V9.7l6-4.5z"></path>
                  </svg>
                </span>
              </div>
              <p>© 2024 Bank of America Corporation.</p>
            </div>
          </div>
        </footer>
        {/* END: Footer */}
      </body>
    </html>
  );
}
