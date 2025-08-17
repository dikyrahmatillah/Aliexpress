# AliExpress API Integration

This project includes a complete TypeScript/React implementation of the AliExpress Affiliate API, converted from the original PHP code.

## Features

- ✅ TypeScript types for all API responses
- ✅ React Query integration for caching and state management
- ✅ Next.js API routes for server-side processing
- ✅ Custom hooks for easy integration
- ✅ Environment variable configuration
- ✅ Error handling and retry logic
- ✅ Automatic MD5 signature generation
- ✅ Product data processing and formatting

## Setup

1. **Environment Variables**
   Copy `.env.example` to `.env.local` and update with your AliExpress API credentials:

   ```bash
   cp .env.example .env.local
   ```

2. **API Credentials**
   Update the following in your `.env.local`:
   ```env
   ALIEXPRESS_APP_KEY=your_app_key
   ALIEXPRESS_SECRET=your_secret_key
   ALIEXPRESS_APP_SIGNATURE=your_app_signature
   ALIEXPRESS_TRACKING_ID=your_tracking_id
   ```

## Usage

### 1. Using React Hooks (Recommended)

```typescript
import { useAliExpressProducts } from "@/hooks/useAliexpress";

function ProductSearch() {
  const { data, isLoading, error } = useAliExpressProducts({
    query: "wireless headphones",
    pageSize: 20,
    sort: "LAST_VOLUME_DESC",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}
```

### 2. Using Mutation Hook (Manual Control)

```typescript
import { useAliExpressProductsMutation } from "@/hooks/useAliexpress";

function SearchButton() {
  const mutation = useAliExpressProductsMutation();

  const handleSearch = () => {
    mutation.mutate({
      query: "phone case",
      minSalePrice: 5,
      pageSize: 50,
    });
  };

  return (
    <button onClick={handleSearch} disabled={mutation.isPending}>
      {mutation.isPending ? "Searching..." : "Search Products"}
    </button>
  );
}
```

### 3. Direct API Calls

#### GET Request

```javascript
const response = await fetch(
  "/api/aliexpress/product?query=laptop&parsed=true&pageSize=20"
);
const data = await response.json();
```

#### POST Request

```javascript
const response = await fetch("/api/aliexpress/product", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "smartphone",
    minSalePrice: 10,
    pageSize: 30,
    sort: "LAST_VOLUME_DESC",
  }),
});
const data = await response.json();
```

### 4. Server-Side Usage

```typescript
import { getAliExpressProductsParsed } from "@/utils/aliexpress";

export async function getServerSideProps() {
  try {
    const products = await getAliExpressProductsParsed({
      query: "electronics",
      pageSize: 20,
    });

    return { props: { products } };
  } catch (error) {
    return { props: { products: null, error: error.message } };
  }
}
```

## API Parameters

| Parameter        | Type   | Default            | Description                 |
| ---------------- | ------ | ------------------ | --------------------------- |
| `query`          | string | **required**       | Search keywords             |
| `minSalePrice`   | number | 5                  | Minimum product price       |
| `categoryIds`    | number | 0                  | Category filter             |
| `pageSize`       | number | 50                 | Number of products per page |
| `pageNo`         | number | 1                  | Page number                 |
| `sort`           | string | "LAST_VOLUME_DESC" | Sort order                  |
| `targetCurrency` | string | "USD"              | Price currency              |
| `targetLanguage` | string | "en"               | Product language            |

## Response Format

### Raw Format (parsed=false)

```json
{
  "total_record_count": 1000,
  "current_record_count": 10,
  "products": {
    "product": ["123456~500~https://image.jpg~Product Title~19.99"]
  }
}
```

### Parsed Format (parsed=true)

```json
{
  "total_record_count": 1000,
  "current_record_count": 10,
  "products": [
    {
      "productId": "123456",
      "volume": 500,
      "imageUrl": "https://image.jpg",
      "title": "Product Title",
      "price": "19.99"
    }
  ]
}
```

## Helper Functions

### Format Products for Display

```typescript
import { formatAliExpressProducts } from "@/hooks/useAliexpress";

const formattedProducts = formatAliExpressProducts(products);
// Returns products with additional computed properties like priceFormatted, affiliateUrl
```

### Parse Product Strings

```typescript
import { parseProductString } from "@/utils/aliexpress";

const product = parseProductString("123456~500~https://image.jpg~Title~19.99");
// Returns: { productId, volume, imageUrl, title, price }
```

## Demo

Visit `/test` to see a working demo of the AliExpress API integration with both query and mutation examples.

## Error Handling

The implementation includes comprehensive error handling:

- Network errors
- API response errors
- Invalid parameters
- Rate limiting
- Automatic retries with exponential backoff

## Performance Optimizations

- React Query caching (5 min stale time, 10 min cache time)
- Debounced search for autocomplete
- Image optimization with Next.js Image component
- Efficient product data processing

## Security Notes

⚠️ **Important**: Keep your API credentials secure:

- Never commit `.env.local` to version control
- Use environment variables in production
- Rotate API keys regularly
- Consider rate limiting on your API routes

## Troubleshooting

### Common Issues

1. **"No products found"**: Check your query parameters and API credentials
2. **Network errors**: Verify your internet connection and API endpoint
3. **Type errors**: Ensure you're using the latest TypeScript definitions

### Debug Mode

Add logging to see the actual API requests:

```typescript
// In utils/aliexpress.ts, add before the fetch call:
console.log("Request URL:", requestUrl);
console.log("Parameters:", params);
```

## Migration from PHP

Key differences from the original PHP implementation:

1. **Type Safety**: Full TypeScript support with proper typing
2. **Modern Async**: Uses fetch API instead of file_get_contents
3. **React Integration**: Built-in hooks for React components
4. **Caching**: React Query handles response caching automatically
5. **Error Handling**: Structured error handling with proper TypeScript types
6. **Environment Config**: Uses Next.js environment variables
7. **Security**: Credentials are stored in environment variables, not hardcoded

The core API logic (MD5 signature generation, parameter sorting, etc.) remains the same to ensure compatibility with AliExpress API requirements.
