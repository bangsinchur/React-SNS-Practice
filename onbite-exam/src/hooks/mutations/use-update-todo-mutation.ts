import { updateTodo } from "@/api/update-todo";
import { QUERY_KEYS } from "@/lib/constants";
import type { Todo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient(); //캐시데이터를 보관하고 있는 쿼리클라이언트를 불러와야하므로.

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo) => {
      // //데이터 조회요청 취소
      // await queryClient.cancelQueries({
      //   queryKey: QUERY_KEYS.todo.list,
      // });

      // //낙관적업데이트 구현
      // const prevTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.todo.list);
      // queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (prevTodos) => {
      //   if (!prevTodos) return [];
      //   return prevTodos.map((prevTodo) =>
      //     prevTodo.id === updatedTodo.id
      //       ? { ...prevTodo, ...updatedTodo }
      //       : prevTodo,
      //   );
      // });

      // return {
      //   prevTodos,
      // };

      //캐시데이터 정규화 1단계
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.todo.detail(updatedTodo.id),
      }); //낙관적 요청 이전 데이터 조회 취소

      const prevTodo = queryClient.getQueryData<Todo>(
        QUERY_KEYS.todo.detail(updatedTodo.id),
      ); //에러 발생시 초기회 하기 위한 저장 작업

      queryClient.setQueryData<Todo>(
        QUERY_KEYS.todo.detail(updatedTodo.id),
        (prevTodo) => {
          if (!prevTodo) return;
          return { ...prevTodo, ...updatedTodo };
        },
      );

      return {
        prevTodo, // onError:(context) 에서 사용하기 위해 내보내준다.
      };
    },
    onError: (error, variable, context) => {
      //에러발생시 원상복구 코드
      if (context && context.prevTodo) {
        queryClient.setQueryData<Todo>(
          QUERY_KEYS.todo.detail(context.prevTodo.id),
          context.prevTodo,
        );
      }
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: QUERY_KEYS.todo.list,
    //   });
    // },
  });
}
