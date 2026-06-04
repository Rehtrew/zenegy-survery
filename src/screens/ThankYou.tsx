export function ThankYou() {
  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center px-6">
      <div className="bg-surface-default rounded-z-l p-12 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-surface-brand rounded-full flex items-center justify-center mx-auto mb-6 anim-check-pop" style={{ color: 'var(--color-action-primary)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 16 4 11"/>
          </svg>
        </div>

        <h1 className="text-[28px] font-medium text-text-primary mb-3">Du er med!</h1>

        <p className="text-[13px] font-medium text-text-secondary mb-1">Lodtrækning d. 1. august 2025</p>
        <p className="text-text-secondary text-[15px] leading-relaxed mb-8">
          Vi trækker en vinder og giver dig besked direkte på din email. Tak fordi du tog dig tid.
        </p>

        <p className="text-sm font-medium text-text-primary mb-4">Kender du nogen der også burde deltage?</p>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://survey.zenegy.com')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-6 py-3 rounded-z-m text-sm font-medium hover:bg-[#0856A8] transition-colors duration-[120ms] ease-[ease] mb-4"
        >
          Del på LinkedIn
        </a>

        <div className="mt-2">
          <a
            href="https://zenegy.com"
            className="text-sm font-medium hover:opacity-80 transition-opacity duration-[120ms] ease-[ease]"
            style={{ color: 'var(--color-action-primary)' }}
          >
            Læs mere om Zenegy
          </a>
        </div>
      </div>
    </div>
  )
}
