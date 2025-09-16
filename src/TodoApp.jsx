import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import {
  todosQueryAtom,
  createTodoMutationAtom,
  updateTodoMutationAtom,
  deleteTodoMutationAtom,
  toggleTodoMutationAtom,
  filterStatusAtom
} from "./atoms";

const TodoApp = () => {
  const navigate = useNavigate();
  const { data: todos, isLoading, isError } = useAtomValue(todosQueryAtom);
  const createTodoMutation = useAtomValue(createTodoMutationAtom);
  const updateTodoMutation = useAtomValue(updateTodoMutationAtom);
  const deleteTodoMutation = useAtomValue(deleteTodoMutationAtom);
  const toggleTodoMutation = useAtomValue(toggleTodoMutationAtom);
  const [filterStatus, setFilterStatus] = useAtom(filterStatusAtom);
  const [newTodoText, setNewTodoText] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");

  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    createTodoMutation.mutate(
      { text: newTodoText },
      {
        onSuccess() {
          setNewTodoText("");
        },
      }
    );
  };

  const handleToggleTodo = (id) => {
    toggleTodoMutation.mutate(id);
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleStartEdit = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    updateTodoMutation.mutate(
      { id, updates: { text: editText } },
      {
        onSuccess() {
          setEditingTodo(null);
          setEditText("");
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditText("");
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (isError) {
    return <div>加载失败，请重试</div>;
  }

  return (
    <div className="todo-container">
      <form onSubmit={handleCreateTodo} className="todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="输入新的 todo..."
          className="todo-input"
        />
        <button
          type="submit"
          disabled={createTodoMutation.isPending}
          className="todo-submit-btn"
        >
          {createTodoMutation.isPending ? "添加中..." : "添加"}
        </button>
      </form>

      {/* 筛选器 */}
      <div className="filter-container">
        <span className="filter-label">筛选:</span>
        <button
          onClick={() => setFilterStatus("all")}
          className={`filter-btn ${filterStatus === "all" ? "active-all" : "inactive"}`}
        >
          全部
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`filter-btn ${filterStatus === "pending" ? "active-pending" : "inactive"}`}
        >
          未完成
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`filter-btn ${filterStatus === "completed" ? "active-completed" : "inactive"}`}
        >
          已完成
        </button>
      </div>

      {/* Todo 列表 */}
      <div>
        {todos && todos.length === 0 ? (
          <p>暂无 todo 项目</p>
        ) : todos.length === 0 ? (
          <p>没有符合筛选条件的 todo 项目</p>
        ) : (
          todos?.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : "pending"}`}
            >
              {/* 完成状态复选框 */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                disabled={toggleTodoMutation.isPending}
                className="todo-checkbox"
              />

              {/* Todo 文本或编辑输入框 */}
              {editingTodo === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="todo-edit-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(todo.id);
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className={`todo-text ${todo.completed ? "completed" : "pending"}`}
                >
                  {todo.text}
                </span>
              )}

              {/* 操作按钮 */}
              <div className="todo-actions">
                {editingTodo === todo.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(todo.id)}
                      disabled={updateTodoMutation.isPending}
                      className="action-btn"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="action-btn"
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate(`/todo/${todo.id}`)}
                      className="action-btn detail-btn"
                    >
                      详情
                    </button>
                    <button
                      onClick={() => handleStartEdit(todo)}
                      className="action-btn"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={deleteTodoMutation.isPending}
                      className="action-btn delete-btn"
                    >
                      删除
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 统计信息 */}
      {todos && (
        <div className="stats">
          总计: {todos.length} 项 | 已完成:{" "}
          {todos.filter((t) => t.completed).length} 项 | 未完成:{" "}
          {todos.filter((t) => !t.completed).length} 项 | 当前显示:{" "}
          {todos.length} 项
        </div>
      )}
    </div>
  );
};

export default TodoApp;
