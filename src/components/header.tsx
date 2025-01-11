"use client";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "./darkMode";
import WalletConnect from "./WalletConnect";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

// interface HeaderProps {
//   selectedPage: string;
//   setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
// }

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex justify-between items-center p-6 md:p-9 md:px-16 border-b-2 dark:border-white font-spaceMono">
      <div className="text-xl md:text-2xl font-bold">
        <Link href="/lottery">popup.capital</Link>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div className="hidden md:flex space-x-4 text-lg items-center gap-10">
        <Link href={"/lottery"} className="hover:underline">
          lottery
        </Link>
        {isClient && (
          <Link href="profile" className="hover:underline">
            <WalletConnect />
          </Link>
        )}
        <ModeToggle />
      </div>
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } fixed inset-0 flex flex-col justify-center items-center bg-white dark:bg-black p-6 md:p-10 z-50 md:hidden`}
      >
        <button onClick={toggleMenu} className="absolute top-6 right-6">
          <FaTimes size={24} />
        </button>
        {isClient && (
          <Link href="profile" className="hover:underline">
            <WalletConnect />
          </Link>
        )}
        <Link href={"/lottery"} className="hover:underline">
          lottery
        </Link>

        {/* <ModeToggle /> */}
      </div>
    </div>
  );
};

export default Header;
