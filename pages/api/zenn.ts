import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // zennAPIからデータを取得する処理
  const response = await fetch("https://zenn.dev/api/articles?username=kinjyo", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  res.status(200).json(data.articles);

}