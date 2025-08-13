import React from "react";

const Newsletter: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to our emails</h2>
          <p className="text-gray-700 mb-8">
            Be the first to know about new collections and exclusive offers.
          </p>

          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-3 border border-gray-300 rounded flex-grow"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-900 transition"
            >
              SIGN UP
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4">
            By clicking &apos;Sign up&apos; you agree that you have read and
            understood Koala&apos;s Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
