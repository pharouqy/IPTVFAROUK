import { Grid, List } from "lucide-react";

const PaginationControls = ({
  viewMode,
  onViewModeChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  darkMode,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 gap-3 sm:gap-0">
      {/* Vue mode - Masqué sur mobile */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs md:text-sm text-gray-600">Vue:</span>
        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded transition-colors ${
            viewMode === "grid"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-pressed={viewMode === "grid"}
        >
          <Grid className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        {/*<button
          type="button"
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded transition-colors ${
            viewMode === "list"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-pressed={viewMode === "list"}
        >
          <List className="w-4 h-4 md:w-5 md:h-5" />
        </button>*/}
      </div>

      {/* Items par page */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
          {totalItems} chaîne{totalItems > 1 ? "s" : ""}
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 md:px-3 py-1 md:py-1.5 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value={12}>12 / page</option>
          <option value={24}>24 / page</option>
          <option value={48}>48 / page</option>
          <option value={96}>96 / page</option>
        </select>
      </div>
    </div>
  );
};

export default PaginationControls;
