import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { SESSION_COOKIE, isAdminConfigured, isValidSessionToken } from "./auth";

export type AdminPageProps = {
	storeKind: "fs" | "github";
};

function storeKind(): "fs" | "github" {
	const configured = process.env.ADMIN_STORE;
	if (configured === "fs" || configured === "github") return configured;
	return process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY
		? "github"
		: "fs";
}

/**
 * 管理画面のページを守る。未ログインならログイン画面へ、
 * 環境変数が未設定なら 404 を返して存在自体を伏せる。
 */
export function withAdminPage(
	context: GetServerSidePropsContext,
): GetServerSidePropsResult<AdminPageProps> {
	if (!isAdminConfigured()) return { notFound: true };
	if (!isValidSessionToken(context.req.cookies[SESSION_COOKIE])) {
		return {
			redirect: {
				destination: `/admin/login?next=${encodeURIComponent(context.resolvedUrl)}`,
				permanent: false,
			},
		};
	}
	return { props: { storeKind: storeKind() } };
}
