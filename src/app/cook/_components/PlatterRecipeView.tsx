'use client';

import { useState } from 'react';
import type { Platter, Recipe, Ingredient } from '../_lib/types';
import { recipes } from '../_lib/recipes';
import { scaleIngredients, formatQuantity, copyToClipboard } from '../_lib/utils';

interface Props {
  platter: Platter;
  onBack: () => void;
  onViewRecipe: (recipe: Recipe) => void;
}

export function PlatterRecipeView({ platter, onBack, onViewRecipe }: Props) {
  const [servings, setServings] = useState(platter.bestFor);
  const [copied, setCopied] = useState(false);

  const dishNames = Object.values(platter.dishes);
  const matchedRecipes = dishNames
    .map((name) => recipes.find((r) => r.name === name))
    .filter((r): r is Recipe => r !== undefined);

  const allScaledIngredients = matchedRecipes.flatMap((recipe) =>
    scaleIngredients(recipe.ingredients, recipe.baseServings, servings).map((ing) => ({
      ...ing,
      fromRecipe: recipe.name,
    }))
  );

  const mergedIngredients = mergeIngredients(allScaledIngredients);

  const handleCopy = async () => {
    const text = mergedIngredients
      .map((ing) => `${ing.name}: ${formatQuantity(ing.quantity, ing.unit)}`)
      .join('\n');
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
        >
          ← Back to Platters
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">
            {platter.emoji} {platter.name}
          </h2>
          <p className="text-xs text-gray-500">{platter.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Servings:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={50}
              value={servings}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= 50) setServings(val);
              }}
              className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center text-sm font-medium focus:ring-2 focus:ring-[#e8a317] focus:border-[#e8a317] outline-none"
            />
            <button
              onClick={() => setServings(Math.min(50, servings + 1))}
              className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200"
            >
              +
            </button>
          </div>
          <span className="text-xs text-gray-500">(Base: {platter.bestFor} people)</span>
          <button
            onClick={() => window.print()}
            className="print:hidden ml-auto px-3 py-2 text-sm rounded-lg bg-[#2d6a4f] text-white hover:bg-[#40916c] transition-colors"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🍱</span> Dishes in This Platter
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {matchedRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onViewRecipe(recipe)}
              className="text-left p-3 rounded-lg bg-[#fdf6ec]/50 hover:bg-[#fdf6ec] transition-colors"
            >
              <div className="text-xs text-gray-500 capitalize">{recipe.category}</div>
              <div className="text-sm font-medium text-gray-800">{recipe.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>🛒</span> Combined Shopping List
          </h3>
          <button
            onClick={handleCopy}
            className="print:hidden text-sm px-3 py-1.5 rounded-lg bg-[#fdf6ec] hover:bg-[#f5e6cc] transition-colors text-gray-700"
          >
            {copied ? '✓ Copied' : '📋 Copy All'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          All ingredients combined for {servings} servings. Duplicates are merged.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-2 text-sm font-medium text-gray-500">Ingredient</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-500">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {mergedIngredients.map((ing, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-[#fdf6ec]/30' : ''}>
                  <td className="py-2 px-2 text-sm text-gray-800">{ing.name}</td>
                  <td className="py-2 px-2 text-sm text-gray-700 text-right font-medium">
                    {formatQuantity(ing.quantity, ing.unit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span> Per-Dish Breakdown
        </h3>
        <div className="space-y-4">
          {matchedRecipes.map((recipe) => {
            const scaled = scaleIngredients(recipe.ingredients, recipe.baseServings, servings);
            return (
              <div key={recipe.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800 text-sm">{recipe.name}</h4>
                  <span className="text-xs text-gray-500 capitalize">{recipe.category}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {scaled.map((ing, idx) => (
                    <div key={idx} className="text-xs text-gray-600">
                      {ing.name}: <span className="font-medium">{formatQuantity(ing.quantity, ing.unit)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function mergeIngredients(ingredients: (Ingredient & { fromRecipe: string })[]): Ingredient[] {
  const map = new Map<string, Ingredient>();
  for (const ing of ingredients) {
    const key = `${ing.name.toLowerCase()}|${ing.unit.toLowerCase()}`;
    if (typeof ing.quantity === 'string') {
      if (!map.has(key)) map.set(key, { name: ing.name, quantity: ing.quantity, unit: ing.unit });
      continue;
    }
    const existing = map.get(key);
    if (existing && typeof existing.quantity === 'number') {
      existing.quantity += ing.quantity;
    } else if (!existing) {
      map.set(key, { name: ing.name, quantity: ing.quantity, unit: ing.unit });
    }
  }
  return Array.from(map.values());
}
