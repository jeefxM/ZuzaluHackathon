"use client";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "./darkMode";
import WalletConnect from "./WalletConnect";
import { FaBars, FaTimes } from "react-icons/fa";

interface HeaderProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ selectedPage, setSelectedPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  console.log(selectedPage);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    setIsOpen(false); // Close the menu after selecting a page
  };

  return (
    <div className="relative flex justify-between items-center p-6 md:p-9 md:px-16 border-b-2 dark:border-white font-spaceMono">
      <div className="text-xl md:text-2xl font-bold">popup.capital</div>
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div className="hidden md:flex space-x-4 text-lg items-center gap-10">
        <button
          onClick={() => handlePageChange("crowdFunding")}
          className="hover:underline"
        >
          crowdfund
        </button>
        <button
          onClick={() => handlePageChange("casino")}
          className="hover:underline"
        >
          casino
        </button>
        <button
          onClick={() => handlePageChange("docs")}
          className="hover:underline"
        >
          docs
        </button>
        {isClient && (
          <button
            onClick={() => handlePageChange("login")}
            className="hover:underline"
          >
            <WalletConnect />
          </button>
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
          <button
            onClick={() => handlePageChange("login")}
            className="hover:underline text-lg md:text-xl mb-4"
          >
            <WalletConnect />
          </button>
        )}
        <button
          onClick={() => handlePageChange("crowdFunding")}
          className="hover:underline text-lg md:text-xl mb-4"
        >
          crowdfund
        </button>
        <button
          onClick={() => handlePageChange("casino")}
          className="hover:underline text-lg md:text-xl mb-4"
        >
          casino
        </button>
        <button
          onClick={() => handlePageChange("docs")}
          className="hover:underline text-lg md:text-xl mb-4"
        >
          docs
        </button>

        {/* <ModeToggle /> */}
      </div>
    </div>
  );
};

export default Header;
