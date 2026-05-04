'use client';

interface Props {
  notes: string;
  difficulty: string;
}

export function BeginnerTips({ notes, difficulty }: Props) {
  const generalTips = [
    'Read the full recipe once before starting.',
    'Prep all ingredients before you begin cooking (mise en place).',
    'Keep heat on medium unless specified otherwise.',
    'Taste and adjust salt at the end.',
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <span>💡</span> Beginner Tips
      </h3>
      {notes && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-100">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Recipe note:</span> {notes}
          </p>
        </div>
      )}
      {difficulty === 'medium' && (
        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-100">
          <p className="text-sm text-gray-700">
            ⚠️ This is a <span className="font-medium">medium difficulty</span> recipe. Take your time and don&apos;t rush the steps.
          </p>
        </div>
      )}
      <ul className="space-y-2">
        {generalTips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="text-[#2d6a4f] mt-0.5">✓</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
