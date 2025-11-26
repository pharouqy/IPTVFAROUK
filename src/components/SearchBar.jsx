import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher une chaîne..."
        className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;