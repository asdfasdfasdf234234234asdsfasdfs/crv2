import type { Metadata } from "next";
import { Globe, ChevronDown } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capital One - Sign In",
  description: "Sign in to your Capital One account.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body className="bg-white min-h-screen flex flex-col">
        {/* BEGIN: MainHeader */}
        <header className="w-full border-b border-gray-100 bg-white" data-purpose="site-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              {/* Capital One Logo */}
              <div className="w-32 h-10 flex items-center justify-start">
                <img src="/capital-one-logo.svg" alt="Capital One" className="h-full w-auto" />
              </div>
            </div>
            {/* Language Selector */}
            <div className="flex items-center space-x-4 text-sm text-gray-700 font-medium cursor-pointer hover:text-cap-blue transition-colors">
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">English</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>
        {/* END: MainHeader */}

        {/* MAIN */}
        <main className="flex-grow flex flex-col items-center px-4 pt-4 pb-12 w-full max-w-lg mx-auto" data-purpose="signin-container">
          {children}
        </main>

        {/* BEGIN: MainFooter */}
        <footer className="w-full border-t border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8 py-10 mt-auto" data-purpose="site-footer">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <ul className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-8 text-sm text-gray-600 font-medium text-center md:text-left items-center md:items-start">
              <li><a className="hover:text-cap-blue transition-colors" href="#">Contact us</a></li>
              <li><a className="hover:text-cap-blue transition-colors" href="#">Legal</a></li>
              <li><a className="hover:text-cap-blue transition-colors" href="#">Privacy</a></li>
              <li><a className="hover:text-cap-blue transition-colors" href="#">Security</a></li>
              <li><a className="hover:text-cap-blue transition-colors" href="#">Terms &amp; Conditions</a></li>
              <li><a className="hover:text-cap-blue transition-colors" href="#">Accessibility</a></li>
            </ul>
            <div className="flex items-center space-x-6 opacity-70 shrink-0">
              <div className="flex items-center">
                <img src="/fdic.svg" alt="Member FDIC" className="h-8 w-auto grayscale opacity-80" />
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <img src="/equal_housing_lender.svg" alt="Equal Housing Opportunity" className="h-8 w-auto grayscale opacity-80" />
              </div>
            </div>
          </div>
        </footer>
        {/* END: MainFooter */}
      </body>
    </html>
  );
}
