import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientAtomProvider } from "jotai-tanstack-query/react";
import TodoApp from "./TodoApp";
import TodoDetail, { todoLoader } from "./TodoDetail";
import {
  useSyncQueryClientAtom,
  useSyncRouterParamsAtom,
} from "./atoms";
import "./index.css";

// 创建 QueryClient 实例
const queryClient = new QueryClient();

// 统一处理路由参数同步
function Layout() {
  useSyncRouterParamsAtom();
  useSyncQueryClientAtom();
  return <Outlet />;
}

// 创建路由配置
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TodoApp />,
      },
      {
        path: "todo/:id",
        element: (
          <Suspense fallback="加载中...">
            <TodoDetail />
          </Suspense>
        ),
        loader: todoLoader(queryClient),
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientAtomProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientAtomProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
