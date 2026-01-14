export interface AliExpressProduct {
  app_sale_price: string;
  app_sale_price_currency: string;
  commission_rate: string;
  discount: string;
  evaluate_rate: string;
  first_level_category_id: number;
  first_level_category_name: string;
  hot_product_commission_rate: string;
  lastest_volume: number;
  original_price: string;
  original_price_currency: string;
  product_detail_url: string;
  product_id: number;
  product_main_image_url: string;
  product_small_image_urls: {
    string: string[];
  };
  product_title: string;
  product_video_url: string;
  promotion_link: string;
  sale_price: string;
  sale_price_currency: string;
  second_level_category_id: number;
  second_level_category_name: string;
  shop_id: number;
  shop_name: string;
  shop_url: string;
  sku_id: string | number;
  target_app_sale_price: string;
  target_app_sale_price_currency: string;
  target_original_price: string;
  target_original_price_currency: string;
  target_sale_price: string;
  target_sale_price_currency: string;
  tax_rate: string;
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

export interface AliExpressQueryParams {
  query: string;
  fields?: string;
  minSalePrice?: number;
  categoryIds?: number;
  pageSize?: number;
  pageNo?: number;
  sort?: string;
  targetCurrency?: string;
  targetLanguage?: string;
  localeSite?: string;
  platformProductType?: string;
}

export interface AliexpressResponse {
  total_record_count: number;
  current_record_count: number;
  products: AliExpressProduct[];
}

export interface AliexpressHotProductResponse {
  aliexpress_affiliate_hotproduct_download_response: {
    resp_result: {
      result: {
        current_page_no: number;
        current_record_count: number;
        products: {
          product: AliExpressProduct[];
        };
      };
    };
  };
}
