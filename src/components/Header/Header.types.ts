export type NavLink = { href: string; label: string };
export type NavItem = {
  key: string;
  label: string;
  width?: string;
  links: NavLink[];
};
