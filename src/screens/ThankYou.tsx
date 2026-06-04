export function ThankYou() {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6 anim-check-pop">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-black text-text-main mb-3">Du er med! 🎁</h1>
        <p className="text-text-muted text-base leading-relaxed mb-8">
          Vi trækker en vinder d. 1. august og giver dig besked direkte på din email. Tak fordi du tog dig tid.
        </p>

        <p className="text-sm font-semibold text-text-main mb-4">Kender du nogen der også burde deltage?</p>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://survey.zenegy.com')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#0856A8] transition-colors mb-4"
        >
          Del på LinkedIn
        </a>

        <div className="mt-2">
          <a
            href="https://zenegy.com"
            className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            Læs mere om Zenegy →
          </a>
        </div>
      </div>
    </div>
  )
}
