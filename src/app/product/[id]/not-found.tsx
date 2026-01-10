import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-medium text-gray-500">404</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Product not available
          </h1>
          <p className="mt-3 text-gray-600">
            The product you’re looking for doesn’t exist, was removed, or can’t
            be accessed right now.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Go to Home
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Search products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
