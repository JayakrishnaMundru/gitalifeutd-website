'use client';

import { useState, useRef, useEffect } from 'react';
import type { Recipe } from '../_lib/types';

interface Props {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  onSelect: (recipe: Recipe) => void;
}

export function RecipeSelector({ recipes, selectedRecipe, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {
    subji: filtered.filter((r) => r.category === 'subji'),
    dal: filtered.filter((r) => r.category === 'dal'),
    rice: filtered.filter((r) => r.category === 'rice'),
    bread: filtered.filter((r) => r.category === 'bread'),
    sweet: filtered.filter((r) => r.category === 'sweet'),
    snack: filtered.filter((r) => r.category === 'snack'),
    side: filtered.filter((r) => r.category === 'side'),
    drink: filtered.filter((r) => r.category === 'drink'),
  };

  const categoryLabels: Record<string, string> = {
    subji: '🥘 Subji',
    dal: '🍲 Dal',
    rice: '🍚 Rice',
    bread: '🫓 Bread',
    sweet: '🍮 Sweet',
    snack: '🥟 Snacks',
    side: '🥗 Sides',
    drink: '🥤 Drinks',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Select a Dish</label>
      <input
        type="text"
        placeholder="Search or select a dish..."
        value={isOpen ? search : selectedRecipe?.name || search}
        onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
        onFocus={() => { setIsOpen(true); setSearch(''); }}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8a317] focus:border-[#e8a317] outline-none text-base bg-white"
        aria-label="Search dishes"
        aria-expanded={isOpen}
        role="combobox"
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-sm">No dishes found</div>
          ) : (
            Object.entries(grouped).map(([category, items]) =>
              items.length > 0 && (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                    {categoryLabels[category]}
                  </div>
                  {items.map((recipe) => (
                    <button
                      key={recipe.id}
                      role="option"
                      aria-selected={selectedRecipe?.id === recipe.id}
                      onClick={() => { onSelect(recipe); setSearch(''); setIsOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-[#fdf6ec] transition-colors ${
                        selectedRecipe?.id === recipe.id ? 'bg-[#f5e6cc] font-medium' : ''
                      }`}
                    >
                      <span className="text-sm">{recipe.name}</span>
                      <span className="ml-2 text-xs text-gray-400 capitalize">{recipe.difficulty}</span>
                    </button>
                  ))}
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}
