import React from 'react';
import { Separator } from '@/components/ui/separator';
// Using custom icons instead of lucide-react

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust Badges */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex items-center gap-2 text-gray-400">
            <img src="/images/icons/verified_shield.png" alt="HIPAA Compliant" className="w-6 h-6" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <img src="/images/icons/lock.png" alt="Security" className="w-6 h-6" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <img src="/images/icons/circle_tick.png" alt="Uptime" className="w-6 h-6" />
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Company Logo and Tagline */}
        <div className="text-center mb-12">
          <img 
            src="/images/brand/sober-living-app-icon.png" 
            alt="Sober Living App Logo" 
            className="w-24 h-24 mx-auto mb-6 opacity-80"
          />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Empowering recovery facilities with the tools they need to transform lives and build sustainable businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="/features" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/demo" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Schedule Demo
                </a>
              </li>
              <li>
                <a href="/mobile" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Mobile App
                </a>
              </li>
              <li>
                <a href="/security" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/guides" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Guides
                </a>
              </li>
              <li>
                <a href="/webinars" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Webinars
                </a>
              </li>
              <li>
                <a href="/support" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Support Center
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="/partners" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://behavehealth.com/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="https://behavehealth.com/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/compliance" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Compliance
                </a>
              </li>
              <li>
                <a href="/hipaa" className="text-sm text-gray-400 hover:text-white transition-colors">
                  HIPAA Notice
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <div className="space-y-3">
              <a 
                href="tel:6503384113" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <img src="/images/icons/phone.png" alt="Phone" className="h-4 w-4" />
                (650) 338-4113
              </a>
              <a 
                href="mailto:contact@behavehealth.com" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors break-all"
              >
                <img src="/images/icons/email.png" alt="Email" className="h-4 w-4" />
                contact@behavehealth.com
              </a>
            </div>
            
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.linkedin.com/company/behavehealth/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <img src="/images/icons/linkedin.png" alt="LinkedIn" className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/behavehealth/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <img src="/images/icons/facebook.png" alt="Facebook" className="h-5 w-5" />
              </a>
              <a
                href="http://vimeo.com/user87016381"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Vimeo"
              >
                <img src="/images/icons/video_call.png" alt="Vimeo" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-gray-800" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              © {currentYear} Behave Health Inc. All rights reserved. Sober Living App® is a registered trademark.
            </p>
            <p className="text-xs text-gray-600">
              548 Market St, NUM 24019, San Francisco, CA 94104
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="#top" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;