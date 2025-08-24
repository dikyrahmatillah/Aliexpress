import type { NavItem } from "./Header.types";

export const NAV_ITEMS: NavItem[] = [
  {
    key: "hardware",
    label: "Hardware",
    width: "w-56",
    links: [
      { href: "/collections/34", label: "Automobiles & Motorcycles" },
      { href: "/collections/1420", label: "Tools" },
      { href: "/collections/6", label: "Home Appliances" },
    ],
  },
  {
    key: "home",
    label: "Home & Living",
    width: "w-64",
    links: [
      { href: "/collections/15", label: "Home & Garden" },
      { href: "/collections/39", label: "Lights & Lighting" },
      { href: "/collections/18", label: "Sports & Entertainment" },
      { href: "/collections/26", label: "Toys & Hobbies" },
    ],
  },
  {
    key: "electronics",
    label: "Electronics",
    width: "w-64",
    links: [
      { href: "/collections/7", label: "Computer & Office" },
      { href: "/collections/44", label: "Consumer Electronics" },
      { href: "/collections/509", label: "Phones & Telecommunications" },
    ],
  },
  {
    key: "fashion",
    label: "Fashion",
    width: "w-64",
    links: [
      { href: "/collections/200000343", label: "Men’s Clothing" },
      { href: "/collections/200000345", label: "Women’s Clothing" },
      { href: "/collections/322", label: "Shoes" },
      { href: "/collections/36", label: "Jewelry & Accessories" },
      { href: "/collections/1511", label: "Watches" },
    ],
  },
];
