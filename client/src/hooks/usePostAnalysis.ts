import { analyzeResume } from "@/apis/resume";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const usePostAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default usePostAnalysis;
