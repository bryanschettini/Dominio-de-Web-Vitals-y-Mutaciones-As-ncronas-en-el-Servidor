export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-6" aria-busy="true">
      <div className="mb-6 h-9 w-48 animate-pulse rounded bg-surface" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    </main>
  );
}
