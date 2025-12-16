import { uploadResume } from "@/apis/resume";
import { useMutation } from "@tanstack/react-query";

const usePostFile = () => {
  return useMutation({
    mutationFn: uploadResume,
    onError: (error) => {
      console.log(error);
    },
  });
};

export default usePostFile;
