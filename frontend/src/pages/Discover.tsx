import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { UniversityDiscover } from '../lib/types';
import UniversityCard from '../components/UniversityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type SortOption = 'rank' | 'rating' | 'reviews';

export default function Discover() {
  const [universities, setUniversities] = useState<UniversityDiscover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState<SortOption>('rank');
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [searchPending, setSearchPending] = useState(false);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = { sort };
      if (nameFilter) params.name = nameFilter;
      if (countryFilter) params.country = countryFilter;
      if (cityFilter) params.city = cityFilter;
      const { data } = await api.get('/universities/discover', { params });
      setUniversities(data);
    } catch {
      setError('Failed to load universities. Make sure the backend is running.');
    } finally {
      setLoading(false);
      setSearchPending(false);
    }
  }, [sort, nameFilter, countryFilter, cityFilter]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPending(true);
    fetchUniversities();
  };

  const clearFilters = () => {
    setNameFilter('');
    setCountryFilter('');
    setCityFilter('');
  };

  const hasFilters = nameFilter || countryFilter || cityFilter;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 badge bg-sky-500/10 text-sky-400 mb-4 text-xs px-3 py-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Community-powered rankings
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Discover Universities</h1>
        <p className="text-slate-400 text-base max-w-xl">
          Explore and compare universities worldwide, ranked by real student reviews and our intelligent scoring algorithm.
        </p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            className="input"
            placeholder="Search by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Filter by country..."
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Filter by city..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Sort by:</span>
            {(['rank', 'rating', 'reviews'] as SortOption[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  sort === s
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {s === 'rank' ? 'Score' : s === 'rating' ? 'Rating' : 'Reviews'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn-secondary text-sm py-1.5 px-3">
                Clear
              </button>
            )}
            <button type="submit" className="btn-primary text-sm py-1.5 px-4" disabled={searchPending}>
              Apply
            </button>
          </div>
        </div>
      </form>

      {loading && <LoadingSpinner text="Fetching universities..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {universities.length} {universities.length === 1 ? 'university' : 'universities'} found
            </p>
          </div>

          {universities.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No universities found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {universities.map((u, i) => (
                <UniversityCard
                  key={u.id}
                  {...u}
                  rank={sort === 'rank' ? i + 1 : undefined}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
