import { togglePostLike } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post, UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useTogglePostLike(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async ({ postId }) => {
      //onMutate는 mutationFn이 호출될때, 전달이 된 인수를 그대로 제공받기때문이다.전달된 인수는{userId,postId} 이다

      //좋아요를 누르기전에 실행될수도 있는 조회를 취소시키는 함수
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.post.byId(postId),
      });

      //onError함수에서 다시 원상복구를 위한 저장함수
      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(postId),
      );

      //캐시데이터를 낙관적으로 업데이트하기 위한 함수
      queryClient.setQueryData<Post>(
        QUERY_KEYS.post.byId(postId), //첫번째 인수로 수정할 캐시데이터의 키값, 두번째 인수로 업데이트를 위한 함수 전달

        //첫번째 키값에 해당하는 캐시데이터를 제공 받는다.
        (post) => {
          if (!post) throw new Error("포스트가 존재하지 않습니다.");
          return {
            ...post,
            isLiked: !post.isLiked,
            like_count: post.isLiked
              ? post.like_count - 1 //true라면 좋아요 상태이니까 -1
              : post.like_count + 1, //false라면 좋아요 상태가 아니니까 + 1
          };
        },
      );
      return {
        prevPost,
      };
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error, _, context) => {
      //낙관적 업데이트 실패시 데이터를 원상복구 하는 함수
      if (context && context.prevPost) {
        queryClient.setQueryData(
          QUERY_KEYS.post.byId(context.prevPost.id),
          context.prevPost,
        );
      }
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
