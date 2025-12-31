import { deleteTodo } from "@/api/delete-todo";
import { QUERY_KEYS } from "@/lib/constants";
import type { Todo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,

    //1.캐시 데이트 무효화 -> .invalidateQueries -> 무효화된 캐시데이터 전체를 다시 불러와야하는 리스크 존재
    //2.수정 요청의 응답값 활용 -> onSuccess
    //3.낙관적 업데이트 -> onMutate

    onSuccess: (deletedTodo) => {
      // queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (prevTodos) => {
      //   if (!prevTodos) return [];
      //   return prevTodos.filter((prevTodo) => prevTodo.id !== deletedTodo.id);
      // });

      //캐시정규화하기
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.todo.detail(deletedTodo.id),
      });

      queryClient.setQueryData<string[]>(
        QUERY_KEYS.todo.list,
        (prevTodoIds) => {
          if (!prevTodoIds) return [];

          return prevTodoIds.filter((id) => id !== deletedTodo.id);
        },
      );
    },
  });
}
