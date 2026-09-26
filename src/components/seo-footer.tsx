export function SeoFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              A monthly grid for your habits — not another todo list
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              <strong className="font-medium text-foreground">HabitsGrid</strong> is a
              spreadsheet-style habit tracker. Each habit is a row, each day is a column.
              Tick a cell to mark it done — watch streaks and patterns emerge across the month.
              Group habits into sections, reorder with drag &amp; drop, recolor, and export your
              grid as a PNG to share.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-foreground">Why a grid?</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  <li>See the whole month at a glance</li>
                  <li>Streaks and gaps are instantly visible</li>
                  <li>Faster than daily checklists — one tap per cell</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Free &amp; Pro</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  <li>
                    <strong className="font-medium text-foreground">Free</strong> — unlimited
                    habits, all themes, local storage (offline)
                  </li>
                  <li>
                    <strong className="font-medium text-foreground">Pro $2.99/mo</strong> — cloud
                    sync via Supabase, multi-device, backups (LemonSqueezy)
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              10 themes · Keyboard accessible · Works on desktop &amp; mobile · Privacy-first analytics
              (DataFast + Vercel Analytics, no third-party cookies)
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">FAQ</h3>
            <dl className="mt-3 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">Is HabitsGrid free?</dt>
                <dd className="mt-1 text-muted-foreground">
                  Yes — unlimited habits and all features work locally for free. Pro adds cloud sync for
                  $2.99/mo.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Do I need an account?</dt>
                <dd className="mt-1 text-muted-foreground">
                  No. Try the demo with no signup. Sign in with Google to sync across devices (Pro accounts only).
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Is my data private?</dt>
                <dd className="mt-1 text-muted-foreground">
                  Free data stays in your browser (localStorage). Pro is stored in Supabase with Row
                  Level Security — only you can access it.
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} HabitsGrid.pro</span>
          <span className="hidden sm:inline">·</span>
          <span>Spreadsheet habit tracker · Daily streak tracker · Monthly grid habit tracker</span>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is HabitsGrid free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes — unlimited habits and all features work locally for free. Pro adds cloud sync for $2.99/mo via LemonSqueezy.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need an account?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. You can try the demo with no signup. Sign in with Google to enable cloud sync across devices.",
                },
              },
              {
                "@type": "Question",
                name: "Is my data private?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Free tier data stays in localStorage on your device. Pro tier is stored in Supabase with Row Level Security — only you can access your data.",
                },
              },
            ],
          }),
        }}
      />
    </footer>
  );
}
