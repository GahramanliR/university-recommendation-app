import { useState, type FormEvent } from 'react';
import api from '../lib/api';
import type { University } from '../lib/types';
import UniversityCard from '../components/UniversityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Search() {
  const [results, setResults] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const params: Record<string, string> = {};
      if (name) params.name = name;
      if (country) params.country = country;
      if (city) params.city = city;
      const { data } = await api.get('/universities/search', { params });
      setResults(data);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setName('');
    setCountry('');
    setCity('');
    setResults([]);
    setSearched(false);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Search Universities</h1>
        <p className="text-slate-400">Find universities by name, country, or city.</p>
      </div>

      <form onSubmit={handleSearch} className="card p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">University name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. MIT, Oxford..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Country</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. United States..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">City</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Cambridge..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
          {searched && (
            <button type="button" onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          )}
        </div>
      </form>

      {loading && <LoadingSpinner text="Searching..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && searched && !error && (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </p>

          {results.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No universities match your search. Try different keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((u) => (
                <UniversityCard key={u.id} {...u} />
              ))}
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="text-center py-20 text-slate-600">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg font-medium text-slate-500">Enter a search term above</p>
          <p className="text-sm mt-1">Search by name, country, or city to find universities</p>
        </div>
      )}
    </div>
  );
}
