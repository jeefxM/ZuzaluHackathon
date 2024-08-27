import React from "react";
import { ModeToggle } from "./darkMode";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const Hero = () => {
  return (
    <div
      className="flex flex-col justify-center items-start gap-5 h-screen p-8 text-white bg-gradient-to-r from-[#000] to-[#ffffff]"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url("/image.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* <ModeToggle /> */}
      <div className="ml-0 md:ml-40">
        <h1 className="font-spaceMono text-4xl md:text-6xl">{`popup.capital`}</h1>
        <p className="font-avenir text-base md:text-lg mt-4 md:mt-6">{`get funding for your popup city now.`}</p>
        <Link href={"/app"}>
          <button
            className="flex items-center gap-2 text-white px-4 py-2 rounded mt-8 md:mt-16 outline-[#00EAFF] outline"
            style={{
              outlineOffset: "2px",
              outlineWidth: "2px",
              borderRadius: "0",
            }}
          >
            Enter App
            <FaArrowRight />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
