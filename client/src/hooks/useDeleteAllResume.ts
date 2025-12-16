import { deleteAllResumes } from "@/apis/resume";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteAllResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllResumes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useDeleteAllResume;
