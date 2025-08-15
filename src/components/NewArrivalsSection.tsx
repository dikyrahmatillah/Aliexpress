"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import "swiper/css";

const tabs = [
  { label: "Featured", url: "/collections/new-arrivals" },
  { label: "Living Room", url: "/collections/living-room-new-arrivals" },
  { label: "Bedroom", url: "/collections/bedroom-new-arrivals" },
  { label: "Homewares", url: "/collections/koala-homewares" },
];

const products = [
  {
    title: "Koala Pillow [2nd Gen]",
    image:
      "https://au.koala.com/cdn/shop/files/Pillow2G_Carousel_1_64008cb3-2466-4fe3-87a0-f93c51fc3b2c.jpg?v=1751870575",
    link: "/products/koala-pillow?variant=43798333620360",
    price: "$139",
    oldPrice: "$155",
    tag: "Up to 10% off",
    rating: 4.6,
    reviews: 5757,
  },
  {
    title: "Byron Sofa Bed [3rd Gen]",
    image:
      "https://au.koala.com/cdn/shop/files/ByronSB_3rdG_Blush_Sunset_8_4d116212-f8a6-4c05-8988-32220645f3b5.png?v=1739506635",
    link: "/products/byron-sofa-bed?variant=43306845470856",
    price: "$1,786",
    oldPrice: "$2,290",
    tag: "Up to 22% off",
    rating: 4.9,
    reviews: 68,
  },
  {
    title: "Bangalow Modular Sofa",
    image:
      "https://au.koala.com/cdn/shop/files/cb6557e64aa9e0b4caa665ec11c26cb4.png?v=1725498735",
    link: "/products/bangalow-modular-sofa?variant=42883800105096",
    price: "$1,404",
    oldPrice: "$1,800",
    tag: "Save 22%",
    rating: 4.8,
    reviews: 120,
  },
  {
    title: "Desert Flowers Cushion",
    image:
      "https://au.koala.com/cdn/shop/files/DesertFlowers_Cushion_4.png?v=1746077758",
    link: "/products/desert-flowers-cushion?variant=43497286008968",
    price: "$41.05",
    oldPrice: "$59",
    tag: "Save 30%",
    rating: 5.0,
    reviews: 13,
  },
  {
    title: "Koala Mattress [3rd Gen]",
    image:
      "https://au.koala.com/cdn/shop/files/Koala_Mattress_3rdG_1.png?v=1746077758",
    link: "/products/koala-mattress?variant=43497286008968",
    price: "$1,099",
    oldPrice: "$1,399",
    tag: "Save 21%",
    rating: 4.7,
    reviews: 15000,
  },
  {
    title: "Koala Mattress [3rd Gen]",
    image:
      "https://au.koala.com/cdn/shop/files/Koala_Mattress_3rdG_1.png?v=1746077758",
    link: "/products/koala-mattress?variant=43497286008968",
    price: "$1,099",
    oldPrice: "$1,399",
    tag: "Save 21%",
    rating: 4.7,
    reviews: 15000,
  },
  {
    title: "Koala Mattress [3rd Gen]",
    image:
      "https://au.koala.com/cdn/shop/files/Koala_Mattress_3rdG_1.png?v=1746077758",
    link: "/products/koala-mattress?variant=43497286008968",
    price: "$1,099",
    oldPrice: "$1,399",
    tag: "Save 21%",
    rating: 4.7,
    reviews: 15000,
  },
];

function NewArrivalsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const visibleProducts = products;

  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };
  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-bold">New arrivals</h2>
            <div className="flex gap-2 ml-4">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                    idx === activeTab
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(idx)}
                  aria-selected={idx === activeTab}
                  role="tab"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <Link
            href={tabs[activeTab].url}
            className="text-blue-600 hover:underline text-sm font-medium mt-4 md:mt-0"
          >
            See All
          </Link>
        </div>
        <div className="relative -mx-4">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition"
            aria-label="Previous"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition"
            aria-label="Next"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <Swiper
            modules={[FreeMode]}
            spaceBetween={16}
            slidesPerView={6}
            slidesPerGroup={1}
            freeMode={false}
            loop={true}
            breakpoints={{
              0: { slidesPerView: 1.2, slidesPerGroup: 1 },
              640: { slidesPerView: 2, slidesPerGroup: 1 },
              1024: { slidesPerView: 3, slidesPerGroup: 1 },
              1280: { slidesPerView: 6, slidesPerGroup: 1 },
            }}
            style={{
              width: "100vw",
              maxWidth: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              paddingLeft: "2rem",
              paddingRight: "2rem",
              paddingBottom: "0.5rem",
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {visibleProducts.map((product, idx) => (
              <SwiperSlide key={idx} style={{ width: "260px", flexShrink: 0 }}>
                <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col group hover:shadow-2xl transition-shadow duration-300">
                  <Link href={product.link} className="block">
                    <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={260}
                        height={325}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.tag && (
                        <span className="absolute top-2 left-2 bg-yellow-200 text-black text-xs font-semibold px-2 py-1 rounded">
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold line-clamp-2 mb-1">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-black">
                          {product.price}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {product.oldPrice}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="inline-block mr-1"
                      >
                        <path d="M8 12.5l-4.33 2.28 1.04-4.5L1 6.77l4.57-.39L8 2.5l2.43 3.88 4.57.39-3.71 3.51 1.04 4.5z" />
                      </svg>
                      {product.rating}{" "}
                      <span className="text-gray-500">({product.reviews})</span>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default NewArrivalsSection;
