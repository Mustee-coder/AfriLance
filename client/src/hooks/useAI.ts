import { useMutation } from "@tanstack/react-query";

import {
  extractJobRequirements,
  generateJobDraft,
  improveCV,
} from "@/api/ai.api";

export const useGenerateJobDraft = () => {
  return useMutation({
    mutationFn: generateJobDraft,
  });
};

export const useExtractJobRequirements = () => {
  return useMutation({
    mutationFn: extractJobRequirements,
  });
};

export const useImproveCV = () => {
  return useMutation({
    mutationFn: improveCV,
  });
};