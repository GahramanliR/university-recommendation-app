import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import type { UniversityIntelligence as UniversityIntelligenceType } from '../lib/types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StarRating from '../components/StarRating';

export default function Intelligence() {
  const { id } = useParams();
  const [data, setData] = useState<UniversityIntelligenceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIntelligence = async () => {
      if (!id) {
        setError('University ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await api.get(`/universities/${id}/intelligence`);
        setData(res.data);
      } catch {
        setError('Failed to load university intelligence.');
      } finally {
        setLoading(false);
      }
    };

    fetchIntelligence();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading intelligence..." />;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const hasScore = data.final_score !== null && data.final_score !== undefined;
  const hasAvg = data.internal_average_rating !== null && data.internal_average_rating !== undefined;
  const displayRating = hasAvg ? data.internal_average_rating : 0;
  const displayScore = hasScore ? data.final_score : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 badge bg-sky-500/10 text-sky-400 mb-4 text-xs px-3 py-1">
          Internal-only intelligence
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {data.name}
            </h1>
            <p className="text-slate-400 max-w-2xl">
              This page shows the university score calculated only from internal reviews on your platform.
            </p>
          </div>

          <Link to={`/universities/${data.id}`} className="btn-secondary inline-flex justify-center w-fit">
            Back to university
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-sm text-slate-500 mb-2">Internal average rating</p>
          {hasAvg ? (
            <div className="flex items-center gap-3">
              <StarRating rating={displayRating} size="lg" />
              <span className="text-3xl font-bold text-white">
                {displayRating.toFixed(2)}
              </span>
            </div>
          ) : (
            <p className="text-slate-400">No reviews yet.</p>
          )}
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-500 mb-2">Final score</p>
          {hasScore ? (
            <div className="text-3xl font-bold text-sky-400">
              {displayScore.toFixed(2)}
            </div>
          ) : (
            <p className="text-slate-400">No score available yet.</p>
          )}
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">How this score works</h2>
        <div className="space-y-3 text-sm text-slate-400 leading-6">
          <p>
            The intelligence score is based only on reviews written by users inside your app.
          </p>
          <p>
            If there are no reviews yet, the page shows no rating and no score instead of inventing one.
          </p>
          <p>
            This keeps the ranking stable, predictable, and easy to trust.
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-500 mb-1">University</p>
            <p className="text-white font-medium">{data.name}</p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-500 mb-1">Internal average</p>
            <p className="text-white font-medium">
              {hasAvg ? displayRating.toFixed(2) : '—'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-xs text-slate-500 mb-1">Final score</p>
            <p className="text-white font-medium">
              {hasScore ? displayScore.toFixed(2) : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}