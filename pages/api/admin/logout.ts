import { clearSessionCookie } from "@/libs/admin/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "POST のみ受け付けます" });
	}
	clearSessionCookie(res);
	return res.status(200).json({ ok: true });
}
