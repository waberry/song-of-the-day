"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({
  searchTerm,
  isDisabled,
  onSearch,
  onFocus,
  onBlur,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder={
            isDisabled ? "Today's song found!" : "Search by artist or title"
          }
          onChange={onSearch}
          onFocus={onFocus}
          onBlur={onBlur}
          value={searchTerm}
          disabled={isDisabled}
          className={`h-12 w-full rounded-full pl-12 pr-4 text-base transition-all duration-300 ease-in-out
          ${
            isDisabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-white text-gray-800 shadow-md hover:shadow-lg focus:shadow-lg"
          }
          border-2 outline-none
          ${
            isDisabled
              ? "border-gray-300"
              : "border-indigo-300 focus:border-indigo-500"
          }`}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <FontAwesomeIcon
            icon={faSearch}
            className={`text-xl ${isDisabled ? "text-gray-400" : "text-indigo-500"}`}
          />
        </div>
        {!isDisabled && searchTerm && (
          <button
            type="button"
            onClick={() => onSearch({ target: { value: "" } })}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        )}
      </div>
    </form>
  );
}
