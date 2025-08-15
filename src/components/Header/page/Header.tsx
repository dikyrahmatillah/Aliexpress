"use client";
import Link from "next/link";
import AnnouncementBar from "../components/AnnouncementBar";
import MainNav from "../components/MainNav";
import UserActions from "../components/UserActions";

export default function Header() {
  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Koala
          </Link>
          <MainNav />
          <UserActions />
        </div>
      </header>
    </>
  );
}
