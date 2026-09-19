import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createResume,
  getMyResume,
  updateMyResume,
  type CreateResumeData,
  type UpdateResumeData,
} from "@/api/resume.api";

export const resumeQueryKey = ["my-resume"];

export const useMyResume = () => {
  return useQuery({
    queryKey: resumeQueryKey,
    queryFn: getMyResume,
    retry: false,
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeData) => createResume(data),
    onSuccess: (response) => {
      queryClient.setQueryData(resumeQueryKey, response);
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateResumeData) => updateMyResume(data),
    onSuccess: (response) => {
      queryClient.setQueryData(resumeQueryKey, response);
    },
  });
};