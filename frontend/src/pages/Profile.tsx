import { useState, useEffect } from 'react';
import api from '../lib/api';
import type { UserProfile, Review } from '../lib/types';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function EditReviewModal({
  review,
  onClose,
  onSave,
}: {
  review: Review;
  onClose: () => void;
  onSave: () => void;
}) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put(`/reviews/${review.id}`, { rating, comment });
      onSave();
      onClose();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || 'Failed to update review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">Edit Review</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-4">{review.university?.name ?? "Unknown university"}</p>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {error && <ErrorMessage message={error} />}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Rating</label>
            <StarRating rating={rating} interactive onChange={setRating} size="lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Comment</label>
            <textarea
              className="input resize-none"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // debugging

  useEffect(() => {
    console.log("PROFILE DATA:", profile);
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/me');
      setProfile(data);
    } catch {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      await fetchProfile();
    } catch {
      alert('Failed to delete review.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSave={fetchProfile}
        />
      )}

      {/* Profile header */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center">
              <span className="text-sky-400 text-2xl font-bold">
                {user?.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user?.username}</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {profile?.total_reviews ?? 0} {profile?.total_reviews === 1 ? 'review' : 'reviews'} written
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            Sign out
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <p className="text-2xl font-bold text-white">{profile?.total_reviews ?? 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total reviews</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {profile?.reviews && profile.reviews.length > 0
                ? (profile.reviews.reduce((s, r) => s + r.rating, 0) / profile.reviews.length).toFixed(1)
                : '—'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Avg rating given</p>
          </div>
          <div>
              <p className="text-2xl font-bold text-white">
                {profile?.reviews
                  ? new Set(
                      profile.reviews
                        .filter(r => r.university?.id)
                        .map(r => r.university.id)
                    ).size
                  : 0}
              </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Your Reviews</h2>

        {(profile?.reviews?.length ?? 0) === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p>You haven't written any reviews yet.</p>
            <Link to="/discover" className="btn-primary inline-block mt-4 text-sm">
              Discover universities
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {profile?.reviews?.map((review) => {
              const date = review.created_at
                ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : null;
              return (
                <div key={review.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/universities/${review.university?.id}`}
                        className="font-semibold text-white hover:text-sky-400 transition-colors text-sm"
                      >
                        {review.university?.name ?? "Unknown university"}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} size="sm" />
                        {date && <span className="text-xs text-slate-600">{date}</span>}
                      </div>
                      <p className="text-slate-300 text-sm mt-2 leading-relaxed">{review.comment}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => setEditingReview(review)} className="btn-secondary text-xs py-1 px-3">Edit</button>
                      <button onClick={() => handleDelete(review.id)} className="btn-danger text-xs py-1 px-3">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
