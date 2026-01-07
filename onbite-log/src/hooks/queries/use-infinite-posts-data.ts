import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;

export function useInfinitePostsData() {
  //개별적인 키를 같는 캐시데이터로 보관될수 있도록 캐시 정규화 작업
  const queryClient = useQueryClient();

  const session = useSession();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const posts = await fetchPosts({ from, to, userId: session!.user.id });
      posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post); // 첫번째 인수로는 "쿼리키"전달,두번째 인수로는 "캐시에 보관될 데이터"
      });
      return posts.map((post) => post.id);
    },
    initialPageParam: 0, //초기페이지번호의 값

    //새로운페이지를 불러와야할때 다음페이지번호를 계산하기위한 함수
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },

    staleTime: Infinity, //어떠한 상황이 되어도 무한스크롤로 불러오는 데이터가 stale상태로 전환되지 않을것이기 때문에 자동으로 리패칭이 일어나지 않음
  });
}
