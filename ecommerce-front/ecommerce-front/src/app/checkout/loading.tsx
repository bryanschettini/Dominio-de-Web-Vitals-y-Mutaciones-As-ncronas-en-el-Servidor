export default function Loading() {
  return (
    <main className="mx-auto max-w-lg p-6" aria-busy="true">
      <div className="mb-6 h-9 w-64 animate-pulse rounded bg-surface" />
      <div className="h-48 animate-pulse rounded bg-surface" />
    </main>
  );
}
