import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // qiitaAPIからデータを取得する処理
  const response = await fetch("https://qiita.com/api/v2/authenticated_user/items", {
    headers: {
      Authorization: `Bearer ${process.env.QIITA_TOKEN}`,
    },
  });
  const data = await response.json();
  res.status(200).json(data);
}
