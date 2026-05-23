export function Footer() {
  return (
    <footer className="aacu-footer" aria-label="aacu site footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <a href="/" title="AACU Home Page" className="footer-logo-link">
              <img 
                src="https://www.aacreditunion.org/globalassets/images/logos/footer-logo.svg" 
                alt="AACU Footer Logo" 
                className="footer-logo"
              />
            </a>
            <p className="routing-number"><strong>ABA / Routing # 311992904</strong></p>
          </div>

          <div className="footer-col links-col">
            <ul className="footer-links">
              <li><a href="#">Online Privacy Policy</a></li>
              <li><a href="#">Privacy Notice</a></li>
              <li><a href="#">Website Accessibility</a></li>
            </ul>
          </div>

          <div className="footer-col chat-col">
            <p className="col-title">Questions?</p>
            <p>Chat Hrs:<br />Monday - Saturday, 8 a.m. - 5 p.m., CDT</p>
          </div>

          <div className="footer-col phone-col">
            <p>(800) 533-0035 within the U.S.</p>
            <p>(817) 952-4500 Outside USA, Canada, Puerto Rico &amp; U.S. Virgin Islands</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container flex-bottom">
          <div className="legal-left">
            <span className="copyright">
              &copy; American Airlines Federal Credit Union 2026 | American Airlines Credit Union and the Flight Symbol are marks of American Airlines, Inc. If you are using a screen reader and are having problems using this website, please call (800) 533-0035 for assistance.
            </span>
            <span className="equal-housing">Equal Housing Lender</span>
          </div>

          <div className="legal-right">
            <img 
              alt="NCUA Logo" 
              src="https://www.aacreditunion.org/globalassets/images/logos/ncualogogw.jpg" 
              className="ncua-logo"
            />
            
            <div className="social-links">
              <p className="social-label">Let's Connect:</p>
              <a href="#" className="social-icon">
                <img src="https://www.aacreditunion.org/globalassets/images/icons/logo-facebook-website-v2-09-2022.svg" alt="Facebook" />
              </a>
              <a href="#" className="social-icon">
                <img src="https://www.aacreditunion.org/globalassets/images/icons/logo-instagram-website-dec-2024.svg" alt="Instagram" />
              </a>
              <a href="#" className="social-icon">
                <img src="https://www.aacreditunion.org/globalassets/images/icons/logo-twitter-x-website-v3-08-2023.svg" alt="X (Twitter)" />
              </a>
              <a href="#" className="social-icon">
                <img src="https://www.aacreditunion.org/globalassets/images/icons/logo-youtube-website-dec-2024.svg" alt="YouTube" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}