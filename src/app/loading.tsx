export default function Loading() {
  return (
    <div className="container relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-11">
      <div className="mx-auto w-full max-w-2xl space-y-8 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm print:space-y-4 print:border-0 print:p-0 print:shadow-none md:p-10">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="size-28 animate-pulse rounded-xl bg-muted" />
        </div>

        {/* Content sections skeleton */}
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton content doesn't reorder
              key={`loading-section-${i}`}
              className="space-y-4"
            >
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
