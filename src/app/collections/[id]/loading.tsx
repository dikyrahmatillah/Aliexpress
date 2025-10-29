export default function CollectionLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2">
            <div className="h-4 w-12 bg-gray-300 rounded"></div>
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </nav>
        </div>
      </div>

      {/* Page Header Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="space-y-3">
            <div className="h-9 bg-gray-300 rounded w-64"></div>
            <div className="h-5 bg-gray-300 rounded w-96"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter Skeleton (optional, depends on your design) */}
          <div className="hidden lg:block w-64 space-y-6">
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-24"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters/Sort Bar Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="h-10 bg-gray-300 rounded w-48"></div>
              <div className="h-10 bg-gray-300 rounded w-32"></div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-3">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-300 rounded-lg"></div>

                  {/* Product Title */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>

                  {/* Rating */}
                  <div className="h-4 bg-gray-300 rounded w-24"></div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-5 bg-gray-300 rounded w-12"></div>
                  </div>

                  {/* Discount Badge */}
                  <div className="h-5 bg-gray-300 rounded w-16"></div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-10 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
