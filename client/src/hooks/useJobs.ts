import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  getMyJobs,
  updateJob,
} from "@/api/jobs.api";

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
};

export const useMyJobs = () => {
  return useQuery({
    queryKey: ["my-jobs"],
    queryFn: getMyJobs,
  });
};

export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    enabled: Boolean(jobId),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-jobs"],
      });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      data,
    }: {
      jobId: string;
      data: Parameters<typeof updateJob>[1];
    }) => updateJob(jobId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", variables.jobId],
      });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,

    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-jobs"],
      });

      queryClient.removeQueries({
        queryKey: ["job", jobId],
      });
    },
  });
};