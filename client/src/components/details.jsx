import React, { useState } from 'react';

const RecipeDetailsDrawer = ({ recipe, onClose }) => {
  const [expandTime, setExpandTime] = useState(false);

  return (
    <div className="w-80 border-l border-gray-300 p-5 bg-white h-screen overflow-y-auto fixed right-0 top-0 shadow-lg z-50">
      <button
        onClick={onClose}
        aria-label="Close details"
        className="absolute top-3 right-3 text-2xl font-bold hover:text-gray-600"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold mb-1 break-words">{recipe.title}</h2>
      <h4 className="text-gray-600 mb-5 break-words">{recipe.cuisine || 'N/A'}</h4>

      <div className="mb-6">
        <strong className="block mb-1">Description:</strong>
        <p className="text-gray-700">{recipe.description || 'No description available.'}</p>
      </div>

      <div className="mb-6">
        <strong
          onClick={() => setExpandTime(!expandTime)}
          className="cursor-pointer select-none flex items-center gap-2 font-semibold text-gray-800"
        >
          Total Time: {recipe.total_time ?? 'N/A'} min
          <span
            className={`transform transition-transform duration-200 ${
              expandTime ? 'rotate-90' : ''
            }`}
          >
            ▶
          </span>
        </strong>
        {expandTime && (
          <div className="mt-2 ml-4 text-gray-700 space-y-1 text-sm">
            <div>Cook Time: {recipe.cook_time ?? 'N/A'} min</div>
            <div>Prep Time: {recipe.prep_time ?? 'N/A'} min</div>
          </div>
        )}
      </div>

      <div>
        <strong className="block mb-2 font-semibold text-gray-800">Nutrition</strong>
        <table className="w-full text-sm text-gray-700 border-collapse">
          <tbody>
            {[
              ['Calories', 'calories'],
              ['Carbohydrates', 'carbohydrateContent'],
              ['Cholesterol', 'cholesterolContent'],
              ['Fiber', 'fiberContent'],
              ['Protein', 'proteinContent'],
              ['Saturated Fat', 'saturatedFatContent'],
              ['Sodium', 'sodiumContent'],
              ['Sugar', 'sugarContent'],
              ['Fat', 'fatContent'],
            ].map(([label, key]) => (
              <tr key={key} className="border-b border-gray-200">
                <td className="font-medium py-1">{label}</td>
                <td className="py-1">{recipe.nutrients?.[key] ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeDetailsDrawer;
