'use client';

import type { Platter } from '../_lib/types';
import { platters } from '../_lib/platters';

interface Props {
  onUsePlatter: (platter: Platter) => void;
}

export function PlatterDashboard({ onUsePlatter }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🍱 Platter Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Complete meal platters for every occasion. Click &quot;Use This Platter&quot; to generate the full ingredient list.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {platters.map((platter) => (
          <PlatterCard key={platter.id} platter={platter} onUse={onUsePlatter} />
        ))}
      </div>
    </div>
  );
}

function PlatterCard({ platter, onUse }: { platter: Platter; onUse: (p: Platter) => void }) {
  const dishEntries = [
    { label: 'Subji', emoji: '🥘', value: platter.dishes.subji },
    { label: 'Dal', emoji: '🍲', value: platter.dishes.dal },
    { label: 'Rice', emoji: '🍚', value: platter.dishes.rice },
    { label: 'Bread', emoji: '🫓', value: platter.dishes.bread },
    { label: 'Sweet', emoji: '🍮', value: platter.dishes.sweet },
    { label: 'Drink', emoji: '🥤', value: platter.dishes.drink },
    { label: 'Side', emoji: '🥗', value: platter.dishes.side },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{platter.emoji}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-base">{platter.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{platter.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-[#c4880f]">⏱ {platter.estimatedTime}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-[#2d6a4f] capitalize">📊 {platter.difficulty}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">👥 Best for {platter.bestFor}</span>
      </div>
      <div className="flex-1 space-y-1.5 mb-4">
        {dishEntries.map((dish) => (
          <div key={dish.label} className="flex items-center gap-2 text-sm">
            <span className="text-xs w-5">{dish.emoji}</span>
            <span className="text-gray-500 text-xs w-12">{dish.label}</span>
            <span className="text-gray-800 text-xs font-medium">{dish.value}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => onUse(platter)}
        className="w-full py-2.5 px-4 rounded-lg bg-[#e8a317] text-white text-sm font-medium hover:bg-[#c4880f] transition-colors shadow-sm"
      >
        🍳 Use This Platter
      </button>
    </div>
  );
}
