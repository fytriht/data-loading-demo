import { useParams } from "react-router-dom";
import { atom, useSetAtom } from "jotai";
import {
  atomWithQuery,
  atomWithMutation,
  queryClientAtom,
  atomWithSuspenseQuery,
} from "jotai-tanstack-query";
import { queryOptions, skipToken } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  fetchTodos,
  fetchTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from "./api";

export const filterStatusAtom = atom("all"); // "all" | "completed" | "pending"

export const selectedTodoIdAtom = atom(null);

export const routerParamsAtom = atom({});

/**
 * 把 react router 的 params 同步到 atom，方便跟其他 atoms 组合使用
 */
export const useSyncRouterParamsAtom = () => {
  const params = useParams();
  const setRouterParams = useSetAtom(routerParamsAtom);
  setRouterParams(params);
};

/**
 * 把 queryClient 同步到 atom，方便跟其他 atoms 组合使用
 */
export const useSyncQueryClientAtom = () => {
  const queryClient = useQueryClient();
  const setQueryClient = useSetAtom(queryClientAtom);
  setQueryClient(queryClient);
};

export const todosQueryAtom = atomWithQuery(() => ({
  queryKey: ["todos"],
  queryFn: fetchTodos,
}));

export const todoListAtom = atom((get) => {
  const todosQuery = get(todosQueryAtom);
  const filterStatus = get(filterStatusAtom);
  const todos = todosQuery.data ?? [];
  if (filterStatus === "completed") {
    return todos.filter((todo) => todo.completed);
  } else if (filterStatus === "pending") {
    return todos.filter((todo) => !todo.completed);
  } else {
    return todos;
  }
});

export const createTodoMutationAtom = atomWithMutation((get) => ({
  mutationFn: createTodo,
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
}));

export const updateTodoMutationAtom = atomWithMutation((get) => ({
  mutationFn: ({ id, updates }) => updateTodo(id, updates),
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
}));

export const deleteTodoMutationAtom = atomWithMutation((get) => ({
  mutationFn: deleteTodo,
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
}));

export const toggleTodoMutationAtom = atomWithMutation((get) => ({
  mutationFn: toggleTodo,
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
}));

export const todoQueryOption = (id) =>
  queryOptions({
    queryKey: ["todo", id],
    queryFn: id ? () => fetchTodoById(id) : skipToken,
  });

export const selectedTodoQueryAtom = atomWithSuspenseQuery((get) => {
  const params = get(routerParamsAtom);
  return todoQueryOption(parseInt(params.id));
});
