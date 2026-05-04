import type { Ingredient, Recipe } from './types';

export function scaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  desiredServings: number
): Ingredient[] {
  const multiplier = desiredServings / baseServings;
  return ingredients.map((ing) => {
    if (typeof ing.quantity === 'string') return ing;
    const scaled = ing.quantity * multiplier;
    return { ...ing, quantity: roundQuantity(scaled) };
  });
}

function roundQuantity(value: number): number {
  if (value <= 0) return 0;
  if (value <= 10) return Math.round(value * 4) / 4;
  return Math.round(value);
}

export function formatQuantity(quantity: number | string, unit: string): string {
  if (typeof quantity === 'string') return quantity;
  const formatted = numberToFraction(quantity);
  return unit ? `${formatted} ${unit}` : formatted;
}

function numberToFraction(num: number): string {
  if (num === 0) return '0';
  const whole = Math.floor(num);
  const decimal = num - whole;
  let fraction = '';
  if (Math.abs(decimal - 0.25) < 0.01) fraction = '¼';
  else if (Math.abs(decimal - 0.5) < 0.01) fraction = '½';
  else if (Math.abs(decimal - 0.75) < 0.01) fraction = '¾';
  else if (Math.abs(decimal - 0.33) < 0.05) fraction = '⅓';
  else if (Math.abs(decimal - 0.67) < 0.05) fraction = '⅔';

  if (whole === 0 && fraction) return fraction;
  if (whole > 0 && fraction) return `${whole}${fraction}`;
  if (whole > 0 && !fraction) return num % 1 === 0 ? `${whole}` : `${num}`;
  return `${num}`;
}

export function getFullMealSuggestion(recipe: Recipe, allRecipes: Recipe[]) {
  const findByCategory = (category: string) => {
    const pairing = recipe.pairings.find((p) => {
      const matched = allRecipes.find((r) => r.name === p && r.category === category);
      return matched && matched.name !== recipe.name;
    });
    if (pairing) return pairing;
    const fallback = allRecipes.find((r) => r.category === category && r.name !== recipe.name);
    return fallback?.name || null;
  };

  return {
    subji: recipe.category === 'subji' ? recipe.name : findByCategory('subji'),
    dal: recipe.category === 'dal' ? recipe.name : findByCategory('dal'),
    rice: findByCategory('rice'),
    bread: findByCategory('bread'),
    sweet: findByCategory('sweet'),
  };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ingredientsToText(ingredients: Ingredient[]): string {
  return ingredients.map((ing) => `${ing.name}: ${formatQuantity(ing.quantity, ing.unit)}`).join('\n');
}
