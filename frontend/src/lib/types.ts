export interface University {
  id: number;
  name: string;
  country: string;
  city: string;
}

export interface UniversityWithReviews extends University {
  average_rating: number | null;
  reviews: Review[];
}

export interface UniversityDiscover extends University {
  average_rating: number;
  review_count: number;
  score: number;
}

export interface UniversityRecommendation extends University {
  average_rating: number;
  review_count: number;
  recommendation_score: number;
}

export interface UserMini {
  id: number;
  username: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: UserMini;
  university: { id: number; name: string };
  created_at: string | null;
  updated_at: string | null;
}

export interface UserProfile {
  id: number;
  username: string;
  total_reviews: number;
  reviews: Review[];
}
