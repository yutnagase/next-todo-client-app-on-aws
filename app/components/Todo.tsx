import { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { TodoType } from "../types";
import { API_URL } from "@/constants/url";

type todoProps = {
  todo: TodoType;
};

const Todo = ({ todo }: todoProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(todo.title);
  const { todos, isLoading, error, mutate } = useTodos();

  /**
   * 編集ボタンクリックイベント
   */
  const handleEdit = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
        }),
      });
      if (response.ok) {
        // 既存Todoリストに編集Todoレコードを反映する
        const editedTodo = await response.json();
        const reflashTodos = todos.map((todo: TodoType) =>
          todo.id === editedTodo.id ? editedTodo : todo
        );
        mutate(reflashTodos);
      }
    }
  };
  /**
   * 削除ボタンクリックイベント
   */
  const handleDelete = async (id: number) => {
    const response = await fetch(`${API_URL}/todos/${todo.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      // 既存Todoリストから削除Todoレコードを除外する
      const reflashTodos = todos.filter((todo: TodoType) => todo.id !== id);
      mutate(reflashTodos);
    }
  };
  /**
   * 完了／未完了切替イベント
   */
  const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
    const response = await fetch(`${API_URL}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isCompleted: !isCompleted,
      }),
    });
    if (response.ok) {
      // 既存Todoリストに編集Todoレコードを反映する
      const editedTodo = await response.json();
      const reflashTodos = todos.map((todo: TodoType) =>
        todo.id === editedTodo.id ? editedTodo : todo
      );
      mutate(reflashTodos);
    }
  };

  return (
    <div>
      <li key={todo.id} className="py-4">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center ${
              todo.isCompleted ? "line-through" : ""
            }`}
          >
            <input
              id="todo1"
              name="todo1"
              type="checkbox"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500
                  border-gray-300 rounded"
              onChange={(e) => toggleTodoCompletion(todo.id, todo.isCompleted)}
            />
            <label className="ml-3 block text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  className="border round py-1 py-2"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <span className="text-lg font-medium mr-2"> {todo.title} </span>
              )}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
            >
              {isEditing ? "save" : "✒"}
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
            >
              ✖
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Todo;
