"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"
        style={{
          backgroundPosition: "center center",
          transform: "perspective(1000px) rotateX(60deg)",
          transformOrigin: "top",
          height: "200%",
        }}
      />

      {/* Glowing effect around main content */}
      <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Main logo and title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-bold font-mono mb-4 relative inline-block">
              {/* Glitch effect layers */}
              <span className="absolute -inset-0.5 text-[#00F2FF] opacity-30 blur-sm">
                popup.capital
              </span>
              <span className="absolute -inset-0.5 text-[#7958FF] opacity-30 animate-pulse">
                popup.capital
              </span>
              <span className="relative bg-gradient-to-r from-[#00F2FF] via-[#7958FF] to-[#FF00FF] text-transparent bg-clip-text">
                popup.capital
              </span>
            </h1>

            <p className="text-gray-400 text-xl md:text-2xl font-mono mt-6 max-w-2xl mx-auto">
              Empowering the future of decentralized crowdfunding through
              innovative lottery systems
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <Link href="/lottery">
              <Button className="px-8 py-6 text-lg bg-transparent border border-[#00F2FF] text-[#00F2FF] hover:bg-[#00F2FF] hover:text-black transition-all duration-300 font-mono">
                Launch App
              </Button>
            </Link>
            <Link href="https://docs.popup.capital" target="_blank">
              <Button
                variant="outline"
                className="px-8 py-6 text-lg border-[#7958FF] text-[#7958FF] hover:bg-[#7958FF] hover:text-black transition-all duration-300 font-mono"
              >
                Documentation
              </Button>
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
          >
            {[
              {
                title: "Decentralized",
                description:
                  "Fully on-chain lottery system with transparent and verifiable randomness",
                color: "#00F2FF",
              },
              {
                title: "Community Driven",
                description:
                  "Empowering popup cities through collective funding mechanisms",
                color: "#7958FF",
              },
              {
                title: "Innovative",
                description:
                  "Cutting-edge blockchain technology powering the future of crowdfunding",
                color: "#FF00FF",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 backdrop-blur-sm"
                style={{ borderColor: feature.color + "44" }}
              >
                <h3
                  className="text-xl font-bold mb-3 font-mono"
                  style={{ color: feature.color }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-400 font-mono">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
};

export default LandingPage;
