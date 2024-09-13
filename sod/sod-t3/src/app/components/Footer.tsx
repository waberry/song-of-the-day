"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup logic
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="mt-auto w-full bg-gradient-to-r from-indigo-800 to-purple-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Song of the Day</h3>
            <p className="text-sm text-gray-300">Guess the daily tune and challenge your music knowledge!</p>
            <div className="flex space-x-4">
              <a href="#" className="transition-transform duration-300 hover:scale-110" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="transition-transform duration-300 hover:scale-110" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#" className="transition-transform duration-300 hover:scale-110" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">How to Play</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">FAQs</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors duration-300">Cookie Policy</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-sm text-gray-300">Subscribe to our newsletter for daily music trivia and updates!</p>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow rounded-l-md border-0 bg-white/10 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="rounded-r-md bg-purple-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Song of the Day. All rights reserved. Made with ❤️ for music lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;