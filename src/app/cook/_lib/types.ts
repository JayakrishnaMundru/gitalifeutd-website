export interface Ingredient {
  name: string;
  quantity: number | string;
  unit: string;
}

export type Category = 'subji' | 'dal' | 'rice' | 'sweet' | 'bread' | 'side' | 'snack' | 'drink';
export type Difficulty = 'easy' | 'medium';

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  baseServings: number;
  prepTime: string;
  cookTime: string;
  ingredients: Ingredient[];
  instructions: string[];
  pairings: string[];
  notes: string;
  difficulty: Difficulty;
}

export interface Platter {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bestFor: number;
  difficulty: Difficulty;
  estimatedTime: string;
  dishes: {
    subji: string;
    dal: string;
    rice: string;
    bread: string;
    sweet: string;
    drink: string;
    side: string;
  };
}
