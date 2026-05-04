'use client';

interface Props {
  instructions: string[];
  prepTime: string;
  cookTime: string;
  difficulty: string;
}

export function InstructionsCard({ instructions, prepTime, cookTime, difficulty }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <span>👩‍🍳</span> Instructions
      </h3>
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-50 text-[#2d6a4f]">
          ⏱ Prep: {prepTime}
        </span>
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-orange-50 text-[#c4880f]">
          🔥 Cook: {cookTime}
        </span>
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 capitalize">
          📊 {difficulty}
        </span>
      </div>
      <ol className="space-y-3">
        {instructions.map((step, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-[#e8a317]/10 text-[#c4880f] flex items-center justify-center text-sm font-semibold">
              {idx + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
