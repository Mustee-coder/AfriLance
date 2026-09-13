import api from "./axios";

export interface CreateReviewData {
  reviewee: string;
  job: string;
  rating: number;
  comment: string;
}

export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
  role: "developer" | "client" | "admin";
}

export interface Review {
  _id: string;
  reviewer: ReviewUser;
  reviewee: ReviewUser;
  job: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  count: number;
  averageRating: number;
  reviews: Review[];
}

export const createReview = async (
  data: CreateReviewData,
): Promise<Review> => {
  const response = await api.post("/reviews", data);
  return response.data.review;
};

export const getUserReviews = async (
  userId: string,
): Promise<ReviewsResponse> => {
  const response = await api.get(`/reviews/user/${userId}`);
  return response.data;
};

export const getJobReviews = async (
  jobId: string,
): Promise<ReviewsResponse> => {
  const response = await api.get(`/reviews/job/${jobId}`);
  return response.data;
};
