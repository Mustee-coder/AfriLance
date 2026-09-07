import { useQuery } from "@tanstack/react-query";

import { getClientDashboard } from "@/api/dashboard.api";

export const useClientDashboard = () => {
  return useQuery({
    queryKey: ["client-dashboard"],
    queryFn: getClientDashboard,
  });
};
