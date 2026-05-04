'use client';

import { useState } from 'react';
import type { Recipe, Platter } from './_lib/types';
import { recipes } from './_lib/recipes';
import { scaleIngredients } from './_lib/utils';
import { RecipeSelector } from './_components/RecipeSelector';
import { ServingsInput } from './_components/ServingsInput';
import { IngredientsTable } from './_components/IngredientsTable';
import { InstructionsCard } from './_components/InstructionsCard';
import { PairingsCard } from './_components/PairingsCard';
import { FullMealSuggestion } from './_components/FullMealSuggestion';
import { BeginnerTips } from './_components/BeginnerTips';
import { PlatterDashboard } from './_components/PlatterDashboard';
import { PlatterRecipeView } from './_components/PlatterRecipeView';

type View = 'planner' | 'platters' | 'platter-detail';

export default function CookPage() {
  const [view, setView] = useState<View>('planner');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(4);
  const [showRecipe, setShowRecipe] = useState(false);
  const [selectedPlatter, setSelectedPlatter] = useState<Platter | null>(null);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setServings(recipe.baseServings);
    setShowRecipe(false);
    setView('planner');
  };

  const handleGenerate = () => {
    if (selectedRecipe) setShowRecipe(true);
  };

  const handleUsePlatter = (platter: Platter) => {
    setSelectedPlatter(platter);
    setView('platter-detail');
  };

  const handleViewRecipeFromPlatter = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setServings(recipe.baseServings);
    setShowRecipe(true);
    setView('planner');
  };

  const scaledIngredients = selectedRecipe
    ? scaleIngredients(selectedRecipe.ingredients, selectedRecipe.baseServings, servings)
    : [];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                <span className="text-[#e8a317]">🙏</span> Satvik Recipe Planner
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                Pure vegetarian • No onion • No garlic
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('planner')}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  view === 'planner'
                    ? 'bg-[#e8a317] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🍳 Planner
              </button>
              <button
                onClick={() => setView('platters')}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  view === 'platters' || view === 'platter-detail'
                    ? 'bg-[#e8a317] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🍱 Platter Dashboard
              </button>
              {showRecipe && view === 'planner' && (
                <button
                  onClick={() => window.print()}
                  className="print:hidden px-3 py-2 text-sm rounded-lg bg-[#2d6a4f] text-white hover:bg-[#40916c] transition-colors hidden sm:flex items-center gap-1"
                >
                  🖨️ Print
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* PLANNER VIEW */}
        {view === 'planner' && (
          <>
            <div className="print:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <RecipeSelector
                    recipes={recipes}
                    selectedRecipe={selectedRecipe}
                    onSelect={handleSelectRecipe}
                  />
                </div>
                <div>
                  {selectedRecipe && (
                    <ServingsInput
                      servings={servings}
                      onChange={setServings}
                      baseServings={selectedRecipe.baseServings}
                    />
                  )}
                </div>
                <div>
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedRecipe}
                    className={`w-full py-3 px-6 rounded-lg text-base font-medium transition-all ${
                      selectedRecipe
                        ? 'bg-[#e8a317] text-white hover:bg-[#c4880f] shadow-md hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    🍳 Generate Recipe
                  </button>
                </div>
              </div>
            </div>

            {showRecipe && selectedRecipe && (
              <div className="space-y-5">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {servings} {servings === 1 ? 'serving' : 'servings'} •{' '}
                    <span className="capitalize">{selectedRecipe.category}</span> •{' '}
                    <span className="capitalize">{selectedRecipe.difficulty}</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <IngredientsTable ingredients={scaledIngredients} />
                  <InstructionsCard
                    instructions={selectedRecipe.instructions}
                    prepTime={selectedRecipe.prepTime}
                    cookTime={selectedRecipe.cookTime}
                    difficulty={selectedRecipe.difficulty}
                  />
                </div>
                <PairingsCard
                  pairings={selectedRecipe.pairings}
                  allRecipes={recipes}
                  onSelectRecipe={handleSelectRecipe}
                />
                <FullMealSuggestion
                  recipe={selectedRecipe}
                  allRecipes={recipes}
                  onSelectRecipe={handleSelectRecipe}
                />
                <BeginnerTips notes={selectedRecipe.notes} difficulty={selectedRecipe.difficulty} />
              </div>
            )}

            {!showRecipe && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🙏</div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Welcome to Satvik Recipe Planner
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select a dish and number of servings, then click &quot;Generate Recipe&quot;
                  to get detailed ingredients and cooking instructions.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-400">
                  <span className="px-2 py-1 bg-white rounded-full">No onion</span>
                  <span className="px-2 py-1 bg-white rounded-full">No garlic</span>
                  <span className="px-2 py-1 bg-white rounded-full">No mushroom</span>
                  <span className="px-2 py-1 bg-white rounded-full">Pure Satvik</span>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => setView('platters')}
                    className="px-5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    🍱 Or explore Platter Dashboard →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* PLATTERS VIEW */}
        {view === 'platters' && <PlatterDashboard onUsePlatter={handleUsePlatter} />}

        {/* PLATTER DETAIL VIEW */}
        {view === 'platter-detail' && selectedPlatter && (
          <PlatterRecipeView
            platter={selectedPlatter}
            onBack={() => setView('platters')}
            onViewRecipe={handleViewRecipeFromPlatter}
          />
        )}
      </main>

      <footer className="print:hidden text-center py-6 text-xs text-gray-400 border-t border-gray-100 mt-8">
        Made with 🙏 for satvik cooking • All recipes are vegetarian, no onion, no garlic
      </footer>
    </>
  );
}
