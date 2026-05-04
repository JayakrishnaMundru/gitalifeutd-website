import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Satvik Recipe Planner',
  description: 'Pure vegetarian recipe planner - No onion, no garlic, no mushroom',
}

export default function CookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-[#fdf6ec] text-[#2d2d2d]">
      {children}
    </div>
  )
}
