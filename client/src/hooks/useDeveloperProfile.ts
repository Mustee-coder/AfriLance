import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";




import {
createDeveloperProfile,
getMyDeveloperProfile,
getDeveloperProfileByUserId,
updateDeveloperProfile,
type DeveloperProfileData,
} from "@/api/developerProfile.api";
export const useDeveloperProfile = () => {
  return useQuery({
    queryKey: ["developer-profile"],
    queryFn: getMyDeveloperProfile,
    retry: false,
  });
};

export const useCreateDeveloperProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeveloperProfileData) =>
      createDeveloperProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["developer-profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["developer-dashboard"],
      });
    },
  });
};

export const useUpdateDeveloperProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeveloperProfileData) =>
      updateDeveloperProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["developer-profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["developer-dashboard"],
      });
    },
  });
};


export const usePublicDeveloperProfile = (
userId?: string,
) => {
return useQuery({
queryKey: ["developer-profile", "public", userId],
queryFn: () => getDeveloperProfileByUserId(userId!),
enabled: Boolean(userId),
});
};

