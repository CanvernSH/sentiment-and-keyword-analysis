'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ sentiment: any; keywords: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: input }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Error');
      } else {
        setResult({
          sentiment: json.sentiment,
          keywords: json.keywords,
        });
      }
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <>
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Sentiment and Keyword Analysis</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={4}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Example: John walked in New York"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analysing...' : 'Analyse'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">Error: {error}</p>}

        {result && (
          <div className="mt-4 space-y-4">
            <div>
              <h2 className="font-semibold">Sentiment Result:</h2>
              <pre className="mt-4 bg-gray-100 text-black p-4 rounded overflow-auto whitespace-pre-wrap">
                {JSON.stringify(result.sentiment, null, 2)}
              </pre>
            </div>

            <div>
              <h2 className="font-semibold"> Keywords:</h2>
              <pre className="mt-4 bg-gray-100 text-black p-4 rounded overflow-auto whitespace-pre-wrap">
                {JSON.stringify(result.keywords, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
      <footer className="mt-8 text-center text-sm text-gray-500">
        Produced by Canvern SH
      </footer>
    </>
  );
}
