import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 5;

export function useInfinitePostsData() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const posts = await fetchPosts({ from, to });
      return posts;
    },
    initialPageParam: 0, //초기페이지번호의 값
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    }, //새로운페이지를 불러와야할때 다음페이지번호를 계산하기위한 함수
  });
}
