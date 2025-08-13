import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Subscribe to our emails</h2>
          <p className="mb-4">
            Be the first to know about new collections and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 border border-gray-300 rounded flex-grow"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded"
            >
              SIGN UP
            </button>
          </form>
          <p className="text-xs mt-2 text-gray-600">
            By clicking &apos;Sign up&apos; you agree that you have read and
            understood Koala&apos;s
            <Link href="/policies/privacy-policy" className="underline ml-1">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-xs mt-2 text-gray-600">
            I agree to receive marketing communications and product updates from
            Koala.
          </p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pages/contact" className="text-sm hover:underline">
                  Contact & FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/delivery"
                  className="text-sm hover:underline"
                >
                  Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/120-night-trial"
                  className="text-sm hover:underline"
                >
                  120-night trial
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/warranty"
                  className="text-sm hover:underline"
                >
                  Warranty
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pages/about-us"
                  className="text-sm hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/our-impact"
                  className="text-sm hover:underline"
                >
                  Our Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs/treetops-blog"
                  className="text-sm hover:underline"
                >
                  Treetops Blog
                </Link>
              </li>
              <li>
                <Link
                  href="https://careers.koala.com/"
                  className="text-sm hover:underline"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pages/refer-a-friend"
                  className="text-sm hover:underline"
                >
                  Refer a Friend
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/finance-options"
                  className="text-sm hover:underline"
                >
                  Finance Options
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/accounts"
                  className="text-sm hover:underline"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/questions"
                  className="text-sm hover:underline"
                >
                  Questions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/collections/mattresses"
                  className="text-sm hover:underline"
                >
                  Mattresses
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/sofa-beds"
                  className="text-sm hover:underline"
                >
                  Sofa Beds
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/sofas-couches"
                  className="text-sm hover:underline"
                >
                  Sofas
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/bedroom"
                  className="text-sm hover:underline"
                >
                  Bedroom
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 mb-6">
          <Link
            href="https://www.facebook.com/koala"
            className="text-gray-600 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
            </svg>
          </Link>
          <Link
            href="https://www.instagram.com/koala"
            className="text-gray-600 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </Link>
        </div>

        {/* Awards and Certifications */}
        <div className="mb-6">
          <div className="flex space-x-6 mb-4">
            <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
              Good Design Award Winner
            </span>
            <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
              Certified B Corporation
            </span>
            <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
              1% for the Planet
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <p className="text-sm mb-4 md:mb-0">© 2025 Koala</p>
            <div className="flex flex-wrap space-x-4">
              <Link
                href="/policies/privacy-policy"
                className="text-sm hover:underline mb-2"
              >
                Privacy Policy
              </Link>
              <Link
                href="/pages/website-terms"
                className="text-sm hover:underline mb-2"
              >
                Website Terms
              </Link>
              <Link
                href="/policies/terms-of-service"
                className="text-sm hover:underline mb-2"
              >
                Terms of Service
              </Link>
              <Link
                href="/pages/promotion-terms"
                className="text-sm hover:underline mb-2"
              >
                Promotion Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
