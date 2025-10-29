export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="container mx-auto px-4 pt-4">
        {/* Breadcrumb Skeleton */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-12 bg-gray-300 rounded"></div>
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
        </nav>

        {/* Main content */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-300 rounded-lg"></div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-8 bg-gray-300 rounded w-full"></div>

                {/* Category badges */}
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                  <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
                </div>

                {/* Store name */}
                <div className="h-4 w-32 bg-gray-300 rounded"></div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="h-5 w-32 bg-gray-300 rounded"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>

              {/* Price Panel Skeleton */}
              <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-10 bg-gray-300 rounded w-40"></div>
                  <div className="h-6 bg-gray-300 rounded w-28"></div>
                </div>

                {/* Quantity selector */}
                <div className="space-y-2">
                  <div className="h-5 bg-gray-300 rounded w-20"></div>
                  <div className="h-10 bg-gray-300 rounded w-32"></div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <div className="h-12 bg-gray-300 rounded w-full"></div>
                  <div className="h-12 bg-gray-300 rounded w-full"></div>
                </div>
              </div>

              {/* Delivery Info Skeleton */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                      <div className="h-3 bg-gray-300 rounded w-48"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-gray-300 rounded-lg"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-300 rounded w-16"></div>
                    <div className="h-5 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
