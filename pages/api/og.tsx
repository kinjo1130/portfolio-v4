import { ImageResponse } from "@vercel/og";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "edge",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchParams } = new URL(req.url || "", "http://localhost");
  const hasTitle = searchParams.has("title");
  const title = hasTitle
    ? searchParams.get("title")?.slice(0, 100)
    : "My default title";
  // const title = req.query.title as string;
  // console.log(title);
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {title}

        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="https://kinjo.me/profile.jpg"
            alt="アイコン"
            style={{
              width: 30, // アイコンの幅
              height: 30, // アイコンの高さ
              marginRight: 5,
              borderRadius: "50%", // 画像を円形にする
            }}
          />
          <span style={{ fontSize: 16 }}>kinjo shotaro</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
