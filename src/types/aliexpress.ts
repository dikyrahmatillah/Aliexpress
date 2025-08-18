export interface AliExpressProduct {
  product_id: string;
  lastest_volume: number;
  product_main_image_url: string;
  product_title: string;
  sale_price: string;
  original_price: string;
  discount: string;
  first_level_category_name: string;
  first_level_category_id: string;
  second_level_category_name: string;
  second_level_category_id: string;
  product_small_image_urls: string[];
  product_video_url: string;
  sku_id: string;
  shop_name: string;
}

export interface AliExpressProductResponse {
  aliexpress_affiliate_product_query_response: {
    resp_result: {
      result: {
        total_record_count: number;
        current_record_count: number;
        products: {
          product: AliExpressProduct[];
        };
      };
    };
  };
}

export interface ProcessedProduct {
  product_id: string;
  volume: number;
  image_url: string;
  title: string;
  original_price: string;
  sale_price: string;
  discount: string;
  first_level_category_name: string;
  first_level_category_id: string;
  second_level_category_name: string;
  second_level_category_id: string;
  product_small_image_urls: string[];
  product_video_url: string;
  sku_id: string;
  shop_name: string;
}

export interface ProductQueryResult {
  total_record_count: number;
  current_record_count: number;
  products: {
    product: string[]; // Format: "id~volume~imageUrl~title~price"
  };
}

export interface AliExpressQueryParams {
  query: string;
  minSalePrice?: number;
  categoryIds?: number;
  pageSize?: number;
  pageNo?: number;
  sort?: string;
  targetCurrency?: string;
  targetLanguage?: string;
}
