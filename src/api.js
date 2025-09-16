// Todo API Mock Implementation

// 模拟数据存储
let todos = [
  { id: 1, text: '学习 React', completed: false },
  { id: 2, text: '学习 Jotai', completed: false },
  { id: 3, text: '学习 TanStack Query', completed: true },
];

let nextId = 4;

// 模拟网络延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 获取所有 todos
export const fetchTodos = async () => {
  await delay();
  return [...todos];
};

// 根据 ID 获取单个 todo
export const fetchTodoById = async (id) => {
  await delay();
  const todo = todos.find(t => t.id === parseInt(id));
  if (!todo) {
    throw new Error('Todo not found');
  }
  return todo;
};

// 创建新 todo
export const createTodo = async (todoData) => {
  await delay();
  const newTodo = {
    id: nextId++,
    text: todoData.text,
    completed: false,
    ...todoData
  };
  todos.push(newTodo);
  return newTodo;
};

// 更新 todo
export const updateTodo = async (id, updates) => {
  await delay();
  const index = todos.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    throw new Error('Todo not found');
  }
  todos[index] = { ...todos[index], ...updates };
  return todos[index];
};

// 删除 todo
export const deleteTodo = async (id) => {
  await delay();
  const index = todos.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    throw new Error('Todo not found');
  }
  const deletedTodo = todos[index];
  todos.splice(index, 1);
  return deletedTodo;
};

// 切换 todo 完成状态
export const toggleTodo = async (id) => {
  await delay();
  const index = todos.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    throw new Error('Todo not found');
  }
  todos[index].completed = !todos[index].completed;
  return todos[index];
};