import { API_URL } from "@/lib/constants";
import type { Todo } from "@/types";

export async function createTodo(content: string) {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    body: JSON.stringify({
      //   id는 생략해도 자동으로 생성됨.
      content,
      isDone: false,
    }),
  });
  if (!response.ok) throw new Error("Fetch failed");

  const data: Todo = await response.json();
  return data;
}
