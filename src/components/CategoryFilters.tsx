"use client";

type PriceRange = {
  label: string;
  min: number;
  max: number;
};

type Props = {
  showFilters: boolean;
  onToggleFilters: () => void;

  selectedSort: string;
  onSortChange: (value: string) => void;

  selectedPriceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
};

export default function CategoryFilters({
  showFilters,
  onToggleFilters,
  selectedSort,
  onSortChange,
  selectedPriceRange,
  onPriceRangeChange,
}: Props) {
  return (
    <div className="lg:w-64 space-y-6">
      <button
        onClick={onToggleFilters}
        className="lg:hidden flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg"
      >
        <span className="flex items-center">Filters</span>
      </button>

      <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer"
          >
            <option value="">Relevance</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="volumeAsc">Sale: Low to High</option>
            <option value="volumeDesc">Sale: High to Low</option>
            <option value="discountAsc">Discount: Low to High</option>
            <option value="discountDesc">Discount: High to Low</option>
            <option value="ratingAsc">Rating: Low to High</option>
            <option value="ratingDesc">Rating: High to Low</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Price Range
          </h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange.label === "All Prices"}
                onChange={() =>
                  onPriceRangeChange({
                    label: "All Prices",
                    min: 0,
                    max: 10000,
                  })
                }
              />
              <span className="ml-2 text-sm text-gray-700 cursor-pointer">
                All Prices
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange.label === "Under $25"}
                onChange={() =>
                  onPriceRangeChange({
                    label: "Under $25",
                    min: 0,
                    max: 25,
                  })
                }
              />
              <span className="ml-2 text-sm text-gray-700 cursor-pointer">
                Under $25
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
