"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-md p-10 text-center">
      <h2 className="text-xl font-semibold">No pudimos cargar esta sección</h2>
      <p role="alert" className="mt-2 text-muted">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark">
        Reintentar
      </button>
    </main>
  );
}
