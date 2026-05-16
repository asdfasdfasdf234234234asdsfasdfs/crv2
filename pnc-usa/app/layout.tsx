import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PNC Personal Banking – Sign On",
  description: "Sign on to PNC Online Banking to manage your accounts securely.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>
        {/* HEADER */}
        <header className="global-header">
          <div className="header-container">
            <button className="hamburger-menu" aria-label="Open menu">
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="logo-container">
              <img src="/pnc-logo-rev.svg" alt="PNC Bank" className="pnc-logo" />
            </div>
            <button className="sign-on-btn-header">SIGN ON</button>
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="global-footer">
          <div className="footer-top">
            <nav className="footer-pillars" aria-label="Business lines">
              <a href="#">PERSONAL</a>
              <a href="#">SMALL BUSINESS</a>
              <a href="#">CORPORATE &amp; INSTITUTIONAL</a>
            </nav>
            <div className="footer-cols">
              <div className="footer-col">
                <h2 className="footer-col-title">SUPPORT</h2>
                <ul>
                  <li><a href="#">Accessible Banking</a></li>
                  <li><a href="#">Customer Service</a></li>
                  <li><a href="#">@PNCBank_Help</a></li>
                  <li><button type="button" className="footer-text-btn">Feedback</button></li>
                </ul>
              </div>
              <div className="footer-col">
                <h2 className="footer-col-title">ON THE GO</h2>
                <ul>
                  <li><a href="#">Locate ATM/Branch</a></li>
                  <li><a href="#">Mobile Apps Directory</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h2 className="footer-col-title">ABOUT</h2>
                <ul>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Corporate Responsibility</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              <ul className="footer-legal-links">
                <li><a href="#">Security</a></li>
                <li><a href="#">Terms &amp; Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><button type="button" className="footer-text-btn">Cookie Preferences</button></li>
              </ul>
              <p className="footer-copyright">&copy;2026 The PNC Financial Services Group, Inc. All rights reserved.</p>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="X (Twitter)"><i className="fab fa-x-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest-p"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
