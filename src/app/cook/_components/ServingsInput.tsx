'use client';

interface Props {
  servings: number;
  onChange: (servings: number) => void;
  baseServings: number;
}

export function ServingsInput({ servings, onChange, baseServings }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(1, servings - 1))}
          className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Decrease servings"
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
            if (val >= 1 && val <= 50) onChange(val);
          }}
          className="w-20 px-3 py-2.5 border border-gray-300 rounded-lg text-center text-base font-medium focus:ring-2 focus:ring-[#e8a317] focus:border-[#e8a317] outline-none"
          aria-label="Number of servings"
        />
        <button
          onClick={() => onChange(Math.min(50, servings + 1))}
          className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Increase servings"
        >
          +
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">Base recipe is for {baseServings} servings</p>
    </div>
  );
}
