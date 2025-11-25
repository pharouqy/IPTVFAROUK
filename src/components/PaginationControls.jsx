import { Grid, List } from "lucide-react";

const PaginationControls = ({
  viewMode,
  onViewModeChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}) => {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200">
      {/* Vue mode */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Vue:</span>
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded ${
            viewMode === "grid"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded ${
            viewMode === "list"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Items par page */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {totalItems} chaîne{totalItems > 1 ? "s" : ""}
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={12}>12 par page</option>
          <option value={24}>24 par page</option>
          <option value={48}>48 par page</option>
          <option value={96}>96 par page</option>
        </select>
      </div>
    </div>
  );
};

export default PaginationControls;
