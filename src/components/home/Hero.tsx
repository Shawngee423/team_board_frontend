import React, { useState } from "react";
import { Search } from "lucide-react";

interface HeroProps {
  onSearch: (keyword: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <section className="bg-gradient-to-r from-primary-400 to-primary-500 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Discover Projects & Build Amazing Teams
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Find the perfect project to collaborate on or build your dream team
          with talented individuals
        </p>

        <form
          onSubmit={handleSearch}
          className="flex items-center max-w-xl mx-auto bg-white rounded-full overflow-hidden p-1"
        >
          <input
            type="search"
            placeholder="Search for projects..."
            className="flex-1 px-4 py-3 text-gray-800 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-colors flex items-center justify-center"
          >
            <Search size={20} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
