import { isDev } from "@/libs/common";
import { use, useEffect, useState } from "react";

// apiRouteからIDを取得していいね数を取得する
export default function useBlogLike() {
  const [likeCount, setLikeCount] = useState<number>(0);
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
  const getBlogLike = async (id: string) => {
    const res = await fetch(`${isDev}/api/mongo/blog/getLike?id=${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch like data");
    }
    const data = await res.json();
    setLikeCount(data.likes);
    return data;
  };

  return { postBlogLike, getBlogLike, likeCount, setLikeCount };
}