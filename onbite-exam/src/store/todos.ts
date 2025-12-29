import type { Todo } from "@/types";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState: {
  todos: Todo[];
} = {
  todos: [],
};

const useTodoStore = create(
  immer(
    combine(initialState, (set) => ({
      actions: {
        createTodo: (content: string) => {
          set((state) => {
            state.todos.push({
              id: new Date().getTime(),
              content: content,
            });
          });
        },
        deleteTodo: (targetId: number) => {
          set((state) => {
            state.todos = state.todos.filter((todo) => todo.id !== targetId);
          });
        },
      },
    })),
  ),
);

export const useTodos = () => {
  const todos = useTodoStore((store) => store.todos);
  return todos;
};

export const useCreateTodo = () => {
  const createTodo = useTodoStore((store) => store.actions.createTodo);
  return createTodo;
};

export const useDeleteTodo = () => {
  const deleteTodo = useTodoStore((store) => store.actions.deleteTodo);
  return deleteTodo;
};
