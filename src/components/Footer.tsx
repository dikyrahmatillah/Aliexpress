import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] pt-16 pb-8">
      <div className="container mx-auto px-4">
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

        {/* Copyright */}
        <div className="border-t border-b border-gray-300 pt-6 pb-4">
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
}
