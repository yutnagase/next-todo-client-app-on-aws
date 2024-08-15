"use client";

import React, { useRef } from "react";
import Todo from "./components/Todo";
import { useTodos } from "./hooks/useTodos";
import { TodoType } from "./types";
import { API_URL } from "@/constants/url";

export default function Home() {
  // useStateだと一文字入力する度にレンダリングされてしまう為、useRefを使用する
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * カスタムフック(全件取得)
   */
  const { todos, isLoading, error, mutate } = useTodos();

  /**
   * Submitイベントハンドラ
   *
   * @param e イベントオブジェクト
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // リロードの阻止
    e.preventDefault();

    const response = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: inputRef.current?.value,
        isCompleted: false,
      }),
    });
    if (response.ok) {
      // 既存Todoリストに新規追加したTodoレコード(newTodo)を追記する
      const newTodo = await response.json();
      // useTodosで取得したdata(todos)にmutate関数を呼び出して、newTodo（追加レコード）を追記する
      mutate([...todos, newTodo]);
      if (inputRef.current?.value) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">
          TODO リスト
        </h1>
      </div>
      <form
        className="w-full max-w-sm mx-auto px-4 py-2"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent
      border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight
      focus:outline-none"
            type="text"
            placeholder="Add a task"
            ref={inputRef}
          />
          <button
            className="duration-150 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200 px-4">
        {todos?.map((todo: TodoType) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
