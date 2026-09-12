import { useQuery } from "@tanstack/react-query";

import { todoApi } from "@/lib/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => todoApi.getDashboard(),
  });
}
