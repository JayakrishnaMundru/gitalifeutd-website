'use client';

import type { Recipe } from '../_lib/types';

interface Props {
  pairings: string[];
  allRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export function PairingsCard({ pairings, allRecipes, onSelectRecipe }: Props) {
  if (pairings.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <span>🍽️</span> Best Pairings
      </h3>
      <div className="flex flex-wrap gap-2">
        {pairings.map((pairing) => {
          const matchedRecipe = allRecipes.find((r) => r.name === pairing);
          return (
            <button
              key={pairing}
              onClick={() => matchedRecipe && onSelectRecipe(matchedRecipe)}
              disabled={!matchedRecipe}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                matchedRecipe
                  ? 'bg-[#fdf6ec] hover:bg-[#f5e6cc] text-gray-800 cursor-pointer'
                  : 'bg-gray-100 text-gray-500 cursor-default'
              }`}
            >
              {pairing}
            </button>
          );
        })}
      </div>
    </div>
  );
}
