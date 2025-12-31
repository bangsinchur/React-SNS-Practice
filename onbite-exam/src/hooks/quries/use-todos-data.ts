import { fetchTodos } from "@/api/fetch-todos";
import { QUERY_KEYS } from "@/lib/constants";
import type { Todo } from "@/types";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useTodosData() {
  const queryClient = useQueryClient();

  return useQuery({
    queryFn: async () => {
      const todos = await fetchTodos();

      todos.forEach((todo) => {
        queryClient.setQueryData<Todo>(QUERY_KEYS.todo.detail(todo.id), todo);
      });

      //todo의 id값만을 참조하기 위해 id값만을 뽑아오는 작업을 함
      return todos.map((todo) => todo.id);
    },
    queryKey: QUERY_KEYS.todo.list,
  });
}
