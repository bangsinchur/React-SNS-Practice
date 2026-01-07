import { fetchPostById } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import { useQuery } from "@tanstack/react-query";

export function usePostByIdData({
  postId,
  type,
}: {
  postId: number;
  type: "FEED" | "DETAIL";
}) {
  const session = useSession();

  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostById({ postId, userId: session!.user.id }), //서버로부터 불러오는것이 아닌 캐시로부터 불러오는 값이기에 굳이 필요하지 않음.
    enabled: type === "FEED" ? false : true, //이 옵션을 통해서 밑에 Fn함수가 실행되지 않도록 하는것(false로 설정시)
  });
}
