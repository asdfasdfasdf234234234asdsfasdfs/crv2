import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harborstone Credit Union",
  description: "Log in to your Harborstone Credit Union online banking account.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>
        {/* ============================================================
            HEADER — Pixel-perfect match of production harborstone.com
            Top: Navy utility bar (Locations, Contact Us, Open Account)
            Bottom: White bar with logo + gold accent border
            ============================================================ */}
        <header>
          {/* Utility bar — navy bg, right-aligned links */}
          <div className="header-utility">
            <div className="header-utility-inner">
              <a href="https://www.harborstone.com/locations" className="header-utility-link">
                <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-header-locations.png" alt="Locations" />
                <span>Locations</span>
              </a>
              <a href="https://www.harborstone.com/contact-us" className="header-utility-link">
                <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-header-phone.png" alt="Contact Us" />
                <span>Contact Us</span>
              </a>
              <a href="https://www.harborstone.com/open-an-account-online-today/" className="header-utility-link">
                <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-header-join.png" alt="Open Account" />
                <span>Open Account</span>
              </a>
            </div>
          </div>

          {/* Logo bar — white bg, logo left, official bottom border image */}
          <div className="header-logo-bar">
            <div className="header-logo-inner">
              <a href="https://www.harborstone.com" aria-label="Harborstone Credit Union Homepage">
                <img src="/img-logo.png" alt="Harborstone Credit Union" className="hs-logo" />
              </a>
            </div>
            <img src="/img-header-bottom.png" alt="" className="header-bottom-image" aria-hidden="true" />
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          {children}
        </main>

        {/* ============================================================
            FOOTER — Pixel-perfect match of production harborstone.com
            Navy bg, 3 columns, bottom bar with badges + routing + social
            ============================================================ */}
        <footer className="site-footer">
          {/* Main footer columns */}
          <div className="footer-main">
            {/* Column 1: THE FINE PRINT */}
            <div className="footer-col">
              <div className="footer-col-title">THE FINE PRINT</div>
              <a href="https://www.harborstone.com/rates-fees/">Rates &amp; Fees</a>
              <a href="https://www.harborstone.com/privacy/">Privacy</a>
              <a href="https://www.harborstone.com/blog/?category=security">Security</a>
              <a href="https://www.harborstone.com/foreclosure-avoidance/">Avoid Foreclosures</a>
              <a href="https://www.harborstone.com/explore">Explore</a>
              <a href="https://www.harborstone.com/personal">Personal</a>
              <a href="https://www.harborstone.com/business">Business</a>
              <a href="https://www.harborstone.com/community">Community</a>
            </div>

            {/* Column 2: TAKE ACTION */}
            <div className="footer-col">
              <div className="footer-col-title">TAKE ACTION</div>
              <a href="https://www.harborstone.com/explore/jobs/">Careers</a>
              <a href="https://www.harborstone.com/contact-us/">Contact Us</a>
              <a href="https://www.harborstone.com/frequently-asked-questions/">FAQ</a>
              <a href="https://www.harborstone.com/frequently-asked-questions/?answerid=5d0a39ab387f237febe06614">Make a Payment</a>
              <a href="https://www.harborstone.com/privacy/">Privacy</a>
              <a href="https://www.harborstone.com/cookies/">Cookies</a>
              <a href="https://www.harborstone.com/site/site-map/">Sitemap</a>
            </div>

            {/* Column 3: DOWNLOAD OUR APP */}
            <div className="footer-col">
              <div className="footer-col-title">Download our App</div>
              <div className="footer-app-icons">
                <a href="http://itunes.apple.com/us/app/harborstone-mobile/id418248045?mt=8" aria-label="Download on the App Store">
                  <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-footer-apple-logo.png" alt="Apple App Store" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.ifs.mobilebanking.fiid3648" aria-label="Get it on Google Play">
                  <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-footer-android-logo.png" alt="Google Play Store" />
                </a>
              </div>
              {/* Social icons */}
              <div className="footer-social">
                <a href="https://www.facebook.com/Harborstone" aria-label="Facebook">
                  <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-footer-facebook-logo.png" alt="Facebook" />
                </a>
                <a href="https://www.instagram.com/harborstonecu/" aria-label="Instagram">
                  <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-footer-instagram-logo.png" alt="Instagram" />
                </a>
                <a href="http://twitter.com/Harborstone" aria-label="Twitter">
                  <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-footer-twitter-logo.png" alt="Twitter" />
                </a>
                <a href="https://www.linkedin.com/company/harborstone-credit-union/" aria-label="LinkedIn">
                  <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-footer-linkedin-logo.png" alt="LinkedIn" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar — badges, legal, routing, social */}
          <div className="footer-bottom">
            <div className="footer-bottom-inner">
              <div className="footer-bottom-left">
                <div className="footer-badges">
                  <a href="https://www.ncua.gov/" aria-label="NCUA">
                    <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-footer-ncua.png" alt="Federally Insured by NCUA" />
                  </a>
                  <a href="https://www.hud.gov/" aria-label="Equal Housing">
                    <img src="https://www.harborstone.com/wp-content/themes/ncr-child-theme/images//icons/icon-footer-equal-housing.png" alt="Equal Housing Opportunity" />
                  </a>
                </div>
                <p className="footer-legal-text">
                  Federally Insured by NCUA<br />
                  Equal Housing Opportunity<br />
                  Harborstone Credit Union. All rights reserved.
                </p>
              </div>
              <div className="footer-routing">
                <strong>Routing Number:</strong> 325180870
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
