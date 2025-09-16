import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { selectedTodoQueryAtom, todoQueryOption } from "./atoms";

export const todoLoader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params;
    if (id) {
      await queryClient.ensureQueryData(todoQueryOption(parseInt(id)));
    }
  };

const TodoDetail = () => {
  const { data: todo } = useAtomValue(selectedTodoQueryAtom);
  const navigate = useNavigate();
  return (
    <div className="detail-container">
      <div className="detail-header">
        <button onClick={() => navigate("/")} className="back-btn">
          ← 返回列表
        </button>
        <h2 className="detail-title">Todo 详情</h2>
      </div>
      <div className="detail-card">
        <div className="detail-row">
          <label className="detail-label">ID:</label>
          <span className="detail-value">{todo.id}</span>
        </div>
        <div className="detail-row">
          <label className="detail-label">内容:</label>
          <span className="detail-value breakable">{todo.text}</span>
        </div>
        <div className="detail-row">
          <label className="detail-label">状态:</label>
          <span
            className={`status-badge ${
              todo.completed ? "completed" : "pending"
            }`}
          >
            {todo.completed ? "已完成" : "待完成"}
          </span>
        </div>
        <div className="detail-row">
          <label className="detail-label">创建时间:</label>
          <span className="detail-value">{todo.createdAt || "未知"}</span>
        </div>
        {todo.completedAt && (
          <div className="detail-row">
            <label className="detail-label">完成时间:</label>
            <span className="detail-value">{todo.completedAt}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoDetail;
