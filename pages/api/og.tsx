import { ImageResponse } from "@vercel/og";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "edge",
};

// デザインの調整はここがおすすめ
// https://og-playground.vercel.app/

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
          margin: '20px'
        }}
      >
        <img
          src="https://kinjo.me/profile.jpg"
          alt="アイコン"
          style={{
            width: 60,  // 明示的に幅を指定
            height: 60,  // 明示的に高さを指定
            marginRight: 5,
            borderRadius: '50%',
          }}
        />
        <span style={{ fontSize: 32 }}>kinjo shotaro</span>
      </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
