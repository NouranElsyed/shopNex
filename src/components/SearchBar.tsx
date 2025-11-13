"use client";

import React, { useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSearch?: () => void;
  onClear?: () => void; 
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search products...",
  className = "",
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    onChange("");
    inputRef.current?.focus();
    onClear?.();
  };

  const keyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") clear();
    else if (e.key === "Enter" && onSearch) onSearch();
  };

  return (
    <div
      className={`
        relative flex items-center w-full max-w-2xl mx-auto
        transition-all duration-200
        ${focused ? "ring-2 ring-[#98c757] ring-offset-2" : "ring-1 ring-gray-300"}
        rounded-xl bg-white shadow-sm ${className}
      `}
    >
      <div className="absolute left-4 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={keyDown}
        placeholder={placeholder}
        className="w-full pl-12 pr-16 py-3 text-base bg-transparent outline-none"
      />

   
      {value && (
        <button
          onClick={clear}
          className="absolute right-12 text-gray-400 hover:text-gray-600"
          aria-label="Clear"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {onSearch && (
        <button
          onClick={onSearch}
          className="absolute right-2 bg-[#98c757] text-white p-2 rounded-lg hover:bg-[#85b048] flex items-center justify-center"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;