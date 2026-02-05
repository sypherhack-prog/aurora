/**
 * Aurora AI logo - flowing aurora borealis waves.
 * Distinctive design, not similar to Vercel or generic icons.
 */
export function AuroraIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 14c2-2 5-3 9-3s7 1 9 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 10c2.5-1.5 5.5-2 9-2s6.5.5 9 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.8}
      />
      <path
        d="M5 18c2.5-1 5-1.5 7-1.5s4.5.5 7 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.6}
      />
    </svg>
  )
}
