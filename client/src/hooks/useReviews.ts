import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  getJobReviews,
  getUserReviews,
  type CreateReviewData,
} from "../api/reviews.api";

export const useUserReviews = (userId?: string) => {
  return useQuery({
    queryKey: ["reviews", "user", userId],
    queryFn: () => getUserReviews(userId!),
    enabled: Boolean(userId),
  });
};

export const useJobReviews = (jobId?: string) => {
  return useQuery({
    queryKey: ["reviews", "job", jobId],
    queryFn: () => getJobReviews(jobId!),
    enabled: Boolean(jobId),
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => createReview(data),

    onSuccess: (_review, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "user", variables.reviewee],
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews", "job", variables.job],
      });
    },
  });
};
