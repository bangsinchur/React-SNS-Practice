import { createTodo } from "@/api/create-todo";
import { QUERY_KEYS } from "@/lib/constants";
import type { Todo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onMutate: () => {}, //요청이 시작되었을때 실행될 이벤트 핸들러
    onSettled: () => {}, //요청이 종료되었을때 실행될 이벤트 핸들러
    onSuccess: (newTodo) => {
      queryClient.setQueryData<Todo>(
        QUERY_KEYS.todo.detail(newTodo.id), //개별캐시데이터로 저장하기 위한 코드
        newTodo, //보관할 값
      );
      queryClient.setQueryData<string[]>( //id값만 보관된 list에 새로운 id값을 추가하기 위한 코드
        QUERY_KEYS.todo.list,
        (prevTodoIds) => {
          if (!prevTodoIds) return [newTodo.id];
          return [...prevTodoIds, newTodo.id];
        },
      );
    }, //요청이 성공했을때 실행될 이벤트핸들러
    onError: () => {}, //요청이 실패했을때 실행될 이벤트핸들러
  });
}
