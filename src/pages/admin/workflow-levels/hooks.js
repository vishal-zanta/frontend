import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../utils/constants";
import { getWorkflowLevels } from "./api";

export const useGetWorkflow = (key = [], params = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WORKFLOW_LEVELS, ...key],
    queryFn: () => getWorkflowLevels(params),
    enabled: !!enabled,
  });
};
