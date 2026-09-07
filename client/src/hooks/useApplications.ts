import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createApplication,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  type CreateApplicationData,
} from "@/api/applications.api";

export const useMyApplications = () => {
  return useQuery({
    queryKey: ["applications", "my"],
    queryFn: getMyApplications,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationData) =>
      createApplication(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications", "my"],
      });

      queryClient.invalidateQueries({
        queryKey: ["developer-dashboard"],
      });
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      withdrawApplication(applicationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications", "my"],
      });

      queryClient.invalidateQueries({
        queryKey: ["developer-dashboard"],
      });
    },
  });
};

export const useJobApplications = (jobId: string) => {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: () => getJobApplications(jobId),
    enabled: Boolean(jobId),
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: "accepted" | "rejected";
    }) =>
      updateApplicationStatus(
        applicationId,
        status,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications", "job"],
      });

      queryClient.invalidateQueries({
        queryKey: ["applications", "my"],
      });

      queryClient.invalidateQueries({
        queryKey: ["client-dashboard"],
      });
    },
  });
};