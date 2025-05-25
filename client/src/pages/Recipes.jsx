import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeDetailsDrawer from '../components/details';
import Star from '../components/star';




const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    cuisine: '',
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [ratingFilter, setRatingFilter] = useState({ op: '>=', value: '' });
  const [timeFilter, setTimeFilter] = useState({ op: '<=', value: '' });
  const [calorieFilter, setCalorieFilter] = useState({ op: '<=', value: '' });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    Object.entries(filters).forEach(([key, val]) => {
      if (val.trim() !== '') {
        params.append(key, val.trim());
      }
    });

    if (ratingFilter.value) params.append('rating', `${ratingFilter.op}${ratingFilter.value}`);
    if (timeFilter.value) params.append('total_time', `${timeFilter.op}${timeFilter.value}`);
    if (calorieFilter.value) params.append('calories', `${calorieFilter.op}${calorieFilter.value}`);

    return params.toString();
  };

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = buildQueryParams();
      const isFiltered = queryParams.includes('title') || queryParams.includes('cuisine') || queryParams.includes('rating') || queryParams.includes('total_time') || queryParams.includes('calories');

      const url = isFiltered
        ? `http://localhost:5000/api/recipes/search?${queryParams}`
        : `http://localhost:5000/api/recipes?page=${page}&limit=${limit}`;

      const res = await axios.get(url);

      setRecipes(res.data.data || []);
      setTotal(res.data.total || res.data.data?.length || 0);
    } catch {
      setError('Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    setSelectedRecipe(null);
  }, [page, limit, filters, ratingFilter, timeFilter, calorieFilter]);

  const totalPages = Math.ceil(total / limit);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleRowClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const truncateText = (text) => {
    if (!text) return '';
    if (text.length > 30) return text.slice(0, 27) + '...';
    return text;
  };

  return (
    <div className="flex">
      <div className={`flex-1 p-5 ${selectedRecipe ? 'mr-80' : ''}`}>
        <h2 className="text-2xl font-semibold mb-4">Recipe List</h2>

      
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            name="title"
            placeholder="Filter by Title"
            value={filters.title}
            onChange={handleFilterChange}
            className=" min-w-[100px] p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="cuisine"
            placeholder="Filter by Cuisine"
            value={filters.cuisine}
            onChange={handleFilterChange}
            className=" min-w-[100px] p-2 border border-gray-300 rounded"
          />

          
        <div className="flex items-center border border-gray-300 rounded w-[130px] overflow-hidden">
  <select
    value={ratingFilter.op}
    onChange={(e) => setRatingFilter({ ...ratingFilter, op: e.target.value })}
    className="bg-white px-2 py-2 h-full border-r border-gray-300 focus:outline-none"
  >
    <option value=">=">&ge;</option>
    <option value="<=">&le;</option>
    <option value="=">=</option>
    <option value=">">&gt;</option>
    <option value="<">&lt;</option>
  </select>
  <input
    type="number"
    step="0.1"
    placeholder="Rating"
    value={ratingFilter.value}
    onChange={(e) => setRatingFilter({ ...ratingFilter, value: e.target.value })}
    className="flex-1 px-2 py-2 focus:outline-none"
  />
</div>


          {/* Time Filter */}
<div className="flex items-center border border-gray-300 rounded w-[150px] overflow-hidden">
  <select
    value={timeFilter.op}
    onChange={(e) => setTimeFilter({ ...timeFilter, op: e.target.value })}
    className="bg-white px-2 py-2 h-full border-r border-gray-300 focus:outline-none"
  >
    <option value=">=">&ge;</option>
    <option value="<=">&le;</option>
    <option value="=">=</option>
    <option value=">">&gt;</option>
    <option value="<">&lt;</option>
  </select>
  <input
    type="number"
    placeholder="Total Time"
    value={timeFilter.value}
    onChange={(e) => setTimeFilter({ ...timeFilter, value: e.target.value })}
    className="flex-1 px-2 py-2 focus:outline-none"
  />
</div>
          {/* Calorie Filter */}
          <div className="flex items-center border border-gray-300 rounded w-[130px] overflow-hidden">
  <select
    value={calorieFilter.op}
    onChange={(e) => setCalorieFilter({ ...calorieFilter, op: e.target.value })}
    className="bg-white px-2 py-2 h-full border-r border-gray-300 focus:outline-none"
  >
    <option value=">=">&ge;</option>
    <option value="<=">&le;</option>
    <option value="=">=</option>
    <option value=">">&gt;</option>
    <option value="<">&lt;</option>
  </select>
  <input
    type="number"
    placeholder="Calories"
    value={calorieFilter.value}
    onChange={(e) => setCalorieFilter({ ...calorieFilter, value: e.target.value })}
    className="flex-1 px-2 py-2 focus:outline-none"
  />
</div>

        </div>

        {loading && <p>Loading recipes...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <p className="italic text-gray-600">No recipes found. Try adjusting your filters.</p>
        )}

        {!loading && !error && recipes.length > 0 && (
          <table className="w-full border-collapse table-auto cursor-pointer">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="max-w-[150px] px-3 py-2 text-left truncate">Title</th>
                <th className="max-w-[120px] px-3 py-2 text-left">Cuisine</th>
                <th className="max-w-[100px] px-3 py-2 text-left">Rating</th>
                <th className="max-w-[120px] px-3 py-2 text-left">Total Time (min)</th>
                <th className="max-w-[100px] px-3 py-2 text-left">Serves</th>
                <th className="max-w-[100px] px-3 py-2 text-left">Calories</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  onClick={() => handleRowClick(recipe)}
                  className="border-b border-gray-200 hover:bg-gray-100"
                  title={recipe.title}
                >
                  <td className="max-w-[150px] px-3 py-2 truncate">{truncateText(recipe.title)}</td>
                  <td className="px-3 py-2">{recipe.cuisine || 'N/A'}</td>
                  <td className="px-3 py-2">{recipe.rating ? <Star rating={recipe.rating} /> : 'N/A'}</td>
                  <td className="px-3 py-2">{recipe.total_time ?? 'N/A'}</td>
                  <td className="px-3 py-2">{recipe.serves ?? 'N/A'}</td>
                  <td className="px-3 py-2">{recipe.nutrients?.calories ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex justify-center gap-2 flex-grow">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="ml-4">
              <label htmlFor="limit" className="mr-2 font-medium text-gray-700">
                Results per page:
              </label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded"
              >
                {[15, 25, 35, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedRecipe && (
        <RecipeDetailsDrawer recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
};

export default Recipes;
