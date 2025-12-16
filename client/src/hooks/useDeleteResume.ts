import { deleteResume } from "@/apis/resume";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useDeleteResume;
