import crypto from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";

export const SESSION_COOKIE = "admin_session";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

// 管理画面は ADMIN_PASSWORD と ADMIN_SESSION_SECRET が両方揃って初めて有効になる。
// 未設定の環境では触れないようにして、空パスワードで開いてしまう事故を防ぐ。
export function isAdminConfigured(): boolean {
	return Boolean(
		process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET,
	);
}

function sha256(value: string): Buffer {
	return crypto.createHash("sha256").update(value, "utf8").digest();
}

// ダイジェスト同士を比べて長さを揃え、比較時間から中身が漏れないようにする
function safeEqual(a: string, b: string): boolean {
	return crypto.timingSafeEqual(sha256(a), sha256(b));
}

function sign(value: string): string {
	return crypto
		.createHmac("sha256", process.env.ADMIN_SESSION_SECRET as string)
		.update(value)
		.digest("base64url");
}

export function verifyPassword(input: string): boolean {
	if (!isAdminConfigured()) return false;
	return safeEqual(input, process.env.ADMIN_PASSWORD as string);
}

export function createSessionToken(): string {
	const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC);
	return `${expiresAt}.${sign(expiresAt)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
	if (!isAdminConfigured() || !token) return false;
	const [expiresAt, mac] = token.split(".");
	if (!expiresAt || !mac) return false;
	if (!safeEqual(mac, sign(expiresAt))) return false;
	return Number(expiresAt) * 1000 > Date.now();
}

function cookie(value: string, maxAgeSec: number): string {
	const attrs = [
		`${SESSION_COOKIE}=${value}`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		`Max-Age=${maxAgeSec}`,
	];
	if (process.env.NODE_ENV === "production") attrs.push("Secure");
	return attrs.join("; ");
}

export function setSessionCookie(res: NextApiResponse): void {
	res.setHeader(
		"Set-Cookie",
		cookie(createSessionToken(), SESSION_MAX_AGE_SEC),
	);
}

export function clearSessionCookie(res: NextApiResponse): void {
	res.setHeader("Set-Cookie", cookie("", 0));
}

export function isSignedIn(req: { cookies: Partial<Record<string, string>> }) {
	return isValidSessionToken(req.cookies[SESSION_COOKIE]);
}

// API ルートの入口。未設定なら 503、未ログインなら 401 を返して false を返す。
export function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
	if (!isAdminConfigured()) {
		res.status(503).json({ error: "管理画面が設定されていません" });
		return false;
	}
	if (!isSignedIn(req)) {
		res.status(401).json({ error: "ログインが必要です" });
		return false;
	}
	return true;
}
