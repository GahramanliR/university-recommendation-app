import { useState, useEffect } from 'react';
import api from '../lib/api';
import type { UniversityRecommendation } from '../lib/types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';

export default function Recommendations() {
  const [universities, setUniversities] = useState<UniversityRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/universities/recommendations')
      .then(({ data }) => setUniversities(data))
      .catch(() => setError('Failed to load recommendations.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 badge bg-amber-500/10 text-amber-400 mb-4 text-xs px-3 py-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          Bayesian weighted ranking
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Top Recommendations</h1>
        <p className="text-slate-400 max-w-xl">
          Universities ranked using a Bayesian weighted formula that balances average rating with review volume, preventing low-review universities from dominating unfairly.
        </p>
      </div>

      {/* Formula explanation */}
      <div className="card p-4 mb-8 bg-slate-900/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200 mb-1">Ranking Formula</p>
            <code className="text-xs text-amber-300 bg-slate-800 px-3 py-1.5 rounded-lg block font-mono">
              score = (v / (v + m)) × R + (m / (v + m)) × C
            </code>
            <p className="text-xs text-slate-500 mt-2">
              R = avg rating · v = review count · m = threshold (5) · C = global average
            </p>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text="Computing rankings..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && universities.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p>No universities with reviews yet. Be the first to write a review!</p>
        </div>
      )}

      {!loading && !error && universities.length > 0 && (
        <div className="flex flex-col gap-3">
          {universities.map((u, i) => (
            <Link key={u.id} to={`/universities/${u.id}`} className="group">
              <div className="card card-hover p-5">
                <div className="flex items-center gap-4">
                  {/* Rank badge */}
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                    ${i === 0 ? 'bg-amber-500/20 text-amber-400' :
                      i === 1 ? 'bg-slate-400/10 text-slate-400' :
                      i === 2 ? 'bg-orange-500/10 text-orange-400' :
                      'bg-slate-800 text-slate-500'}`}
                  >
                    #{i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors truncate">
                      {u.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {u.city}, {u.country}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2">
                      <StarRating rating={u.average_rating} size="sm" />
                      <span className="text-sm text-slate-300 font-medium">{u.average_rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{u.review_count} reviews</span>
                      <span className="badge bg-sky-500/10 text-sky-400 px-2 py-0.5">
                        {u.recommendation_score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
