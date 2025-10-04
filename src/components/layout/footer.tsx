export function Footer() {
  return (
    <footer className="bg-page border-t border-border mt-xxl">
      <div className="max-w-page mx-auto px-lg py-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
          {/* Company Info */}
          <div className="space-y-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-page font-bold text-sm">R</span>
              </div>
              <span className="ml-sm text-h2 font-semibold text-text">Recycly</span>
            </div>
            <p className="text-muted">
              Making recycling rewarding for everyone in Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-sm">
            <h3 className="text-h2 font-semibold text-text">Quick Links</h3>
            <ul className="space-y-xs">
              <li>
                <a href="/" className="text-muted hover:text-primary transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/deposit" className="text-muted hover:text-primary transition-colors">
                  Deposit Waste
                </a>
              </li>
              <li>
                <a href="/rewards" className="text-muted hover:text-primary transition-colors">
                  Rewards
                </a>
              </li>
              <li>
                <a href="/help" className="text-muted hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-sm">
            <h3 className="text-h2 font-semibold text-text">Support</h3>
            <ul className="space-y-xs">
              <li>
                <a href="/contact" className="text-muted hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-muted hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-sm">
            <h3 className="text-h2 font-semibold text-text">Contact</h3>
            <div className="space-y-xs">
              <p className="text-muted">Email: support@recycly.ng</p>
              <p className="text-muted">Phone: +234 800 000 0000</p>
              <p className="text-muted">Lagos, Nigeria</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-xl pt-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted">
              © 2024 Recycly Nigeria. All rights reserved.
            </p>
            <div className="flex space-x-lg mt-sm md:mt-0">
              <a href="#" className="text-muted hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
