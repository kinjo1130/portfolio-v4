import {
	isAdminConfigured,
	setSessionCookie,
	verifyPassword,
} from "@/libs/admin/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "POST のみ受け付けます" });
	}
	if (!isAdminConfigured()) {
		return res.status(503).json({ error: "管理画面が設定されていません" });
	}

	const password = (req.body as { password?: unknown } | undefined)?.password;
	if (typeof password !== "string" || !verifyPassword(password)) {
		return res.status(401).json({ error: "パスワードが違います" });
	}

	setSessionCookie(res);
	return res.status(200).json({ ok: true });
}
