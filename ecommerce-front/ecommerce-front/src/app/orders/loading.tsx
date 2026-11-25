export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-6" aria-busy="true">
      <div className="mb-6 h-9 w-48 animate-pulse rounded bg-surface" />
      <div className="h-40 animate-pulse rounded-lg bg-surface" />
    </main>
  );
}
