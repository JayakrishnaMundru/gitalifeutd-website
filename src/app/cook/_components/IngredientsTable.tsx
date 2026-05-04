'use client';

import { useState } from 'react';
import type { Ingredient } from '../_lib/types';
import { formatQuantity, ingredientsToText, copyToClipboard } from '../_lib/utils';

interface Props {
  ingredients: Ingredient[];
}

export function IngredientsTable({ ingredients }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = ingredientsToText(ingredients);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>🧾</span> Ingredients
        </h3>
        <button
          onClick={handleCopy}
          className="print:hidden text-sm px-3 py-1.5 rounded-lg bg-[#fdf6ec] hover:bg-[#f5e6cc] transition-colors text-gray-700"
          aria-label="Copy ingredients to clipboard"
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-2 text-sm font-medium text-gray-500">Ingredient</th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-500">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-[#fdf6ec]/30' : ''}>
                <td className="py-2.5 px-2 text-sm text-gray-800">{ing.name}</td>
                <td className="py-2.5 px-2 text-sm text-gray-700 text-right font-medium">
                  {formatQuantity(ing.quantity, ing.unit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
