import useSWR from "swr";
import { API_URL } from "@/constants/url";

/**
 * 全件データ取得API(GET)のデータを返す非同期関数
 * @param key
 * @returns 全件データ
 */
async function fetcher(key: string) {
  return fetch(key).then((res) => res.json());
}

export const useTodos = () => {
  // SWR: データ取得のための React Hooks ライブラリ
  // HTTP キャッシュ無効化戦略である stale-while-revalidate に由来
  // SWR は、まずキャッシュからデータを返し（stale）、次にフェッチリクエストを送り（revalidate）、最後に最新のデータを持ってくるという戦略
  // (キャッシュをなるべく最新に保つ機能)
  // key: API の URL
  // fetcher: データを返す任意の非同期関数
  // 返却値: data, isLoading, error
  // dataには、fetcherがresolve した値( 通信結果 )が入っている
  // SWR はリモートデータとキャッシュデータのミューテーションのために、mutate の API を提供しているので、ここで指定
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/todos`,
    fetcher
  );

  // 戻り値
  return {
    todos: data,
    isLoading: isLoading,
    error: error,
    mutate: mutate,
  };
};
