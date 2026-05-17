import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import type { UniversityWithReviews, Review } from '../lib/types';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

function ReviewCard({
  review,
  currentUserId,
  onDelete,
  onEdit,
}: {
  review: Review;
  currentUserId?: number;
  onDelete: (id: number) => void;
  onEdit: (review: Review) => void;
}) {
  const isOwner = currentUserId === review.user.id;
  const date = review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-sky-500/20 rounded-full flex items-center justify-center">
              <span className="text-sky-400 text-xs font-bold">{review.user.username[0].toUpperCase()}</span>
            </div>
            <span className="text-sm font-medium text-slate-300">{review.user.username}</span>
            {date && <span className="text-xs text-slate-600">{date}</span>}
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        {isOwner && (
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => onEdit(review)} className="btn-secondary text-xs py-1 px-3">Edit</button>
            <button onClick={() => onDelete(review.id)} className="btn-danger text-xs py-1 px-3">Delete</button>
          </div>
        )}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mt-2">{review.comment}</p>
    </div>
  );
}

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();

  const [university, setUniversity] = useState<UniversityWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchUniversity = async () => {
    try {
      const { data } = await api.get(`/universities/${id}`);
      setUniversity(data);
    } catch {
      setError('University not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  const userReview = university?.reviews.find((r) => r.user.id === user?.id);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview.id}`, { rating: reviewRating, comment: reviewComment });
      } else {
        await api.post('/reviews/', { rating: reviewRating, comment: reviewComment, university_id: Number(id) });
      }
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewRating(5);
      setReviewComment('');
      await fetchUniversity();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setReviewError(detail || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      await fetchUniversity();
    } catch {
      alert('Failed to delete review.');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    setShowReviewForm(true);
  };

  const cancelForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setReviewRating(5);
    setReviewComment('');
    setReviewError('');
  };

  if (loading) return <LoadingSpinner />;
  if (error || !university) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ErrorMessage message={error || 'University not found.'} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/discover" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Discover
        </Link>

        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{university.name}</h1>
              <div className="flex items-center gap-1.5 text-slate-400">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {university.city}, {university.country}
              </div>
            </div>

            <div className="flex gap-4 sm:flex-col sm:items-end">
              {university.average_rating !== null ? (
                <div className="card bg-slate-800/50 px-4 py-3 text-center">
                  <div className="text-3xl font-bold text-white">{university.average_rating.toFixed(1)}</div>
                  <StarRating rating={university.average_rating} size="sm" />
                  <div className="text-xs text-slate-500 mt-1">{university.reviews.length} reviews</div>
                </div>
              ) : (
                <div className="card bg-slate-800/50 px-4 py-3 text-center">
                  <div className="text-slate-500 text-sm">No ratings</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Reviews <span className="text-slate-500 font-normal text-base">({university.reviews.length})</span>
          </h2>

          {isAuthenticated && !userReview && !showReviewForm && (
            <button onClick={() => setShowReviewForm(true)} className="btn-primary text-sm">
              Write a review
            </button>
          )}
          {isAuthenticated && userReview && !showReviewForm && (
            <span className="text-xs text-slate-500 badge bg-slate-800">You reviewed this</span>
          )}
          {!isAuthenticated && (
            <Link to="/login" className="btn-secondary text-sm">
              Sign in to review
            </Link>
          )}
        </div>

        {/* Review form */}
        {showReviewForm && (
          <div className="card p-5 mb-4 border-sky-500/30">
            <h3 className="font-semibold text-white mb-4">{editingReview ? 'Edit review' : 'Write a review'}</h3>
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
              {reviewError && <ErrorMessage message={reviewError} />}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Rating</label>
                <StarRating rating={reviewRating} interactive onChange={setReviewRating} size="lg" />
                <span className="text-sm text-slate-500 mt-1 block">{reviewRating} / 5</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Comment</label>
                <textarea
                  className="input resize-none"
                  rows={4}
                  placeholder="Share your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={reviewLoading}>
                  {reviewLoading ? 'Submitting...' : editingReview ? 'Update review' : 'Submit review'}
                </button>
                <button type="button" onClick={cancelForm} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews list */}
        {university.reviews.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {university.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.id}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
