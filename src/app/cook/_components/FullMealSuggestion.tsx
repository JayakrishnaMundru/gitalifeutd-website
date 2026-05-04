'use client';

import type { Recipe } from '../_lib/types';
import { getFullMealSuggestion } from '../_lib/utils';
import { recipes } from '../_lib/recipes';

interface Props {
  recipe: Recipe;
  allRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export function FullMealSuggestion({ recipe, allRecipes, onSelectRecipe }: Props) {
  const meal = getFullMealSuggestion(recipe, allRecipes);

  const mealItems = [
    { label: 'Subji', emoji: '🥘', value: meal.subji },
    { label: 'Dal', emoji: '🍲', value: meal.dal },
    { label: 'Rice', emoji: '🍚', value: meal.rice },
    { label: 'Bread', emoji: '🫓', value: meal.bread },
    { label: 'Sweet', emoji: '🍮', value: meal.sweet },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <span>🍱</span> Make it a Full Meal
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {mealItems.map((item) => {
          const matchedRecipe = item.value ? recipes.find((r) => r.name === item.value) : null;
          return (
            <div key={item.label} className="text-center p-3 rounded-lg bg-[#fdf6ec]/50">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              {item.value ? (
                <button
                  onClick={() => matchedRecipe && onSelectRecipe(matchedRecipe)}
                  disabled={!matchedRecipe}
                  className={`text-sm font-medium ${
                    matchedRecipe ? 'text-[#c4880f] hover:underline cursor-pointer' : 'text-gray-700'
                  }`}
                >
                  {item.value}
                </button>
              ) : (
                <span className="text-sm text-gray-400">—</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
