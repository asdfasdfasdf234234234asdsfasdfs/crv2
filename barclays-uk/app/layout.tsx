import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Step 1 - Login details - Barclays Online Banking",
  description: "Log in to Barclays Online Banking.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* HEADER — 86px, white, no border, eagle+wordmark left, Secure right */}
        <header className="global-header">
          <div className="header-container">
            <div className="logo-container">
              <a href="#" className="logo-decoration" aria-label="Barclays Homepage">
                <img src="/Eagle_RGB_Cyan_Large.svg" alt="" className="eagle-icon" />
                <img src="/logo.svg" alt="Barclays" className="barclays-logo-text" />
              </a>
            </div>
            <div className="header-secure">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <a href="#">Secure</a>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          {children}
        </main>

        {/* FOOTER — transparent, minimal links */}
        <footer className="login-footer">
          <div className="footer-container">
            <ul className="footer-links">
              <li><a href="#">Service status</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Accessibility</a></li>
              <li><a href="#">See our cookies policy</a></li>
            </ul>
            <p className="footer-legal-text">
              Barclays Bank UK PLC. Authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority (Financial Services Register number: 759676). Registered in England. Registered No. 9740322. Registered Office: 1 Churchill Place, London E14 5HP. Barclays Bank UK PLC adheres to The Standards of Lending Practice which is monitored and enforced by the LSB: www.lendingstandardsboard.org.uk
            </p>
            <p className="footer-copyright">&copy; Barclays {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
