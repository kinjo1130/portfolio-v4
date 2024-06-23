import { isDev } from "@/libs/common";

// apiRouteからIDを取得していいね数を取得する
export default function useBlogLike() {
  // いいね数の:numberだけ帰ってくる
  const postBlogLike = async (id: string) => {
    const res = await fetch(`${isDev}/api/mongo/blog/postLike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      throw new Error("Failed to like post");
    }
    return res.json();
  }
  return { postBlogLike };
}