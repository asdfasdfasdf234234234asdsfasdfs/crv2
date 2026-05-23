"use client";

import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="aacu-header" aria-label="aacu site header">
      <div className="header-container">
        <div className="main-nav-wrapper">
          <div className="logo-main">
            <a href="/" title="AACU Home Page">
              <img 
                src="https://www.aacreditunion.org/globalassets/images/logos/aacu-logo-90th-emblem.svg" 
                alt="AACU Logo" 
                className="hs-logo"
              />
            </a>
          </div>

          <nav aria-label="Main Navigation" className="main-nav desktop-nav">
            <div className="nav-header"><a href="#"><span className="nav-header-text">Banking</span></a></div>
            <div className="nav-header"><a href="#"><span className="nav-header-text">Borrowing</span></a></div>
            <div className="nav-header"><a href="#"><span className="nav-header-text">Planning</span></a></div>
            <div className="nav-header"><a href="#"><span className="nav-header-text">Learning</span></a></div>
            <div className="nav-header"><a href="#"><span className="nav-header-text">Membership</span></a></div>
          </nav>

          <button 
            className="mobile-menu-toggle" 
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="mobile-nav-menu">
          <ul>
            <li><a href="#">Banking</a></li>
            <li><a href="#">Borrowing</a></li>
            <li><a href="#">Planning</a></li>
            <li><a href="#">Learning</a></li>
            <li><a href="#">Membership</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
}