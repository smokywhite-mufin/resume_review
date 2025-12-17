import { getResume } from "@/apis/resume";
import { useQuery } from "@tanstack/react-query";

const useGetResume = (resumeId: number) => {
  return useQuery({
    queryKey: ["resume"],
    queryFn: () => getResume(resumeId),
  });
};

export default useGetResume;
