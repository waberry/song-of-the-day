import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full bg-indigo-800 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Song of the Day</h3>
            <p className="text-sm text-gray-400">Guess the daily tune!</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="transition-colors duration-300 hover:text-purple-400"
            >
              About
            </a>
            <a
              href="#"
              className="transition-colors duration-300 hover:text-purple-400"
            >
              Contact
            </a>
            <a
              href="#"
              className="transition-colors duration-300 hover:text-purple-400"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Song of the Day. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
