import { Link } from 'react-router-dom';
import StarRating from './StarRating';

interface UniversityCardProps {
  id: number;
  name: string;
  country: string;
  city: string;
  average_rating?: number;
  review_count?: number;
  score?: number;
  rank?: number;
}

export default function UniversityCard({ id, name, country, city, average_rating, review_count, score, rank }: UniversityCardProps) {
  return (
    <Link to={`/universities/${id}`} className="block group">
      <div className="card card-hover p-5 h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {rank !== undefined && (
              <span className="badge bg-sky-500/10 text-sky-400 mb-2">#{rank}</span>
            )}
            <h3 className="font-semibold text-white text-base leading-snug group-hover:text-sky-400 transition-colors truncate">
              {name}
            </h3>
          </div>
          {score !== undefined && (
            <div className="shrink-0 text-right">
              <div className="text-lg font-bold text-sky-400">{score.toFixed(2)}</div>
              <div className="text-xs text-slate-500">score</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{city}, {country}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
          {average_rating !== undefined && average_rating > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating rating={average_rating} size="sm" />
              <span className="text-sm text-slate-300 font-medium">{average_rating.toFixed(1)}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-600">No ratings yet</span>
          )}
          {review_count !== undefined && (
            <span className="text-xs text-slate-500">
              {review_count} {review_count === 1 ? 'review' : 'reviews'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
