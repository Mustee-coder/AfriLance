import { useQuery } from "@tanstack/react-query";
import { getDeveloperDashboard } from "@/api/dashboard.api";

export const useDeveloperDashboard = () => {
  return useQuery({
    queryKey: ["developer-dashboard"],
    queryFn: getDeveloperDashboard,
  });
};
