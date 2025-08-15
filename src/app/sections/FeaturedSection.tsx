"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const brands = [
  {
    name: "Calvin Klein",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-calvin-klein.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/calvin-klein/",
    alt: "sixsilver jubiler marki home calvin klein",
  },
  {
    name: "Boska",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-boska.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/boska/",
    alt: "sixsilver jubiler marki home boska",
  },
  {
    name: "Tommy Hilfiger",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-tommy-hilfiger.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/tommy-hilfiger/",
    alt: "sixsilver jubiler marki home tommy hilfiger",
  },
  {
    name: "TI SENTO - Milano",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-ti-sento.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/ti-sento-milano/",
    alt: "sixsilver jubiler marki home ti sento",
  },
  {
    name: "PDPAOLA",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-pdpaola.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/pdpaola/",
    alt: "sixsilver jubiler marki home pdpaola",
  },
  {
    name: "NOMINATION ITALY",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-nomination.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/nomination/",
    alt: "sixsilver jubiler marki home nomination",
  },
  {
    name: "Motyle",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-motyle.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/motyle/",
    alt: "sixsilver jubiler marki home motyle",
  },
  {
    name: "Manoki",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-manoki.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/manoki/",
    alt: "sixsilver jubiler marki home manoki",
  },
  {
    name: "Lineargent",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-lineargent.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/lineargent/",
    alt: "sixsilver jubiler marki home lineargent",
  },
  {
    name: "Dall'Acqua",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-dallacqua.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/dallacqua/",
    alt: "sixsilver jubiler marki home dallacqua",
  },
  {
    name: "Coeur de Lion",
    image:
      "https://sixsilver.pl/wp-content/webp-express/webp-images/uploads/2024/02/sixsilver-jubiler-marki-home-coeur-de-lion.jpg.webp",
    link: "https://sixsilver.pl/kategoria/marki/coeur-de-lion/",
    alt: "sixsilver jubiler marki home coeur de lion",
  },
];

export default function FeaturedSection() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [startIdx, setStartIdx] = useState(0);
  const maxIdx = brands.length - visibleCount;

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 900) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1200) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1600) {
        setVisibleCount(4);
      } else {
        setVisibleCount(5);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (startIdx > brands.length - visibleCount) {
      setStartIdx(Math.max(0, brands.length - visibleCount));
    }
  }, [visibleCount, startIdx]);

  const scroll = (dir: "left" | "right") => {
    setStartIdx((prev) => {
      if (dir === "left") {
        return prev > 0 ? prev - 1 : 0;
      } else {
        return prev < brands.length - visibleCount ? prev + 1 : prev;
      }
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="px-4">
        {/* <h2 className="text-5xl font-extrabold text-center mb-10">
          <Link
            href="https://sixsilver.pl/kategoria/marki/"
            className="hover:text-blue-600"
            title="Marki modowe"
          >
            Featured Products
          </Link>
        </h2> */}
        <div className="flex justify-center mb-12">
          <div className="w-40 h-2 bg-gray-200 rounded-full" />
        </div>
        <div className="relative">
          <button
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition hidden md:block"
            onClick={() => scroll("left")}
            type="button"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2 pb-4 w-full justify-center">
            {brands
              .slice(startIdx, startIdx + visibleCount)
              .map((brand, idx) => (
                <div
                  key={startIdx + idx}
                  style={{
                    flex: `0 0 calc(${100 / visibleCount}% - 0.5rem)`,
                    maxWidth: `calc(${100 / visibleCount}% - 0.5rem)`,
                    minWidth: 0,
                  }}
                  className="flex-shrink-0 bg-white rounded-2xl shadow-sm group overflow-hidden"
                >
                  <Link href={brand.link} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={brand.image}
                        alt={brand.alt}
                        width={300}
                        height={400}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-xl font-semibold">{brand.name}</h3>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
          <button
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition hidden md:block"
            onClick={() => scroll("right")}
            type="button"
            disabled={startIdx === maxIdx || brands.length <= visibleCount}
            style={{
              opacity:
                startIdx === maxIdx || brands.length <= visibleCount ? 0.5 : 1,
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
