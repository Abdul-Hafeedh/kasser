"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold text-red-600 mb-4">Fejl</h2>
        <pre className="text-xs text-slate-700 bg-slate-100 p-4 rounded-lg overflow-auto mb-4 whitespace-pre-wrap">
          {error.message}
          {error.digest && `\nDigest: ${error.digest}`}
          {error.stack && `\n\n${error.stack}`}
        </pre>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
        >
          Prøv igen
        </button>
      </div>
    </div>
  );
}
