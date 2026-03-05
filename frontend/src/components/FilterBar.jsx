const FilterBar = ({ filter, setFilter }) => {
  const filters = ["all", "completed", "pending"];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
            filter === f
              ? "bg-stone-700 text-white"
              : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
