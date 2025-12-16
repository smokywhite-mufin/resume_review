import { getAllResumes } from "@/apis/resume";
import { GetAllResumesResponse } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetAllResumes = () => {
  return useInfiniteQuery({
    queryKey: ["resumes"],
    queryFn: ({ pageParam }) => getAllResumes(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage: GetAllResumesResponse) => lastPage.nextCursor,
  });
};

export default useGetAllResumes;
