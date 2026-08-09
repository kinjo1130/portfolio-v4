import path from "node:path";

/**
 * 管理画面からのコンテンツ書き込み先。
 *
 * ローカル開発ではリポジトリのファイルをそのまま書き換え、本番 (Vercel) では
 * GitHub にコミットする。コミットが入れば Vercel が再ビルドしてサイトに反映される。
 * 実行中のサーバーのファイルシステムは使い捨てなので、本番で fs に書いても消える。
 */

export type FileChange =
	| { path: string; text: string }
	| { path: string; base64: string }
	| { path: string; deleted: true };

export type CommitResult = { committed: boolean; url?: string };

export interface ContentStore {
	readonly kind: "fs" | "github";
	list(dir: string): Promise<string[]>;
	read(filePath: string): Promise<string | null>;
	commit(changes: FileChange[], message: string): Promise<CommitResult>;
}

// リポジトリ外への書き込みを防ぐ。管理画面から渡ってくるパスは必ずここを通す。
export function assertSafePath(filePath: string): string {
	const normalized = path.posix.normalize(filePath);
	if (
		normalized.startsWith("/") ||
		normalized.startsWith("..") ||
		normalized.includes("\0")
	) {
		throw new Error(`不正なパスです: ${filePath}`);
	}
	return normalized;
}

export function changeToBuffer(change: FileChange): Buffer {
	if ("text" in change) return Buffer.from(change.text, "utf-8");
	if ("base64" in change) return Buffer.from(change.base64, "base64");
	throw new Error("削除の変更をバッファに変換しようとしました");
}

type GitHubConfig = { repo: string; branch: string; token: string };

class GitHubStore implements ContentStore {
	readonly kind = "github" as const;

	constructor(private readonly config: GitHubConfig) {}

	private async api<T>(
		endpoint: string,
		init?: { method?: string; body?: unknown },
	): Promise<T> {
		const res = await fetch(
			`https://api.github.com/repos/${this.config.repo}${endpoint}`,
			{
				method: init?.method ?? "GET",
				headers: {
					Authorization: `Bearer ${this.config.token}`,
					Accept: "application/vnd.github+json",
					"X-GitHub-Api-Version": "2022-11-28",
					"Content-Type": "application/json",
				},
				body: init?.body ? JSON.stringify(init.body) : undefined,
			},
		);
		if (!res.ok) {
			throw new Error(
				`GitHub API ${init?.method ?? "GET"} ${endpoint} が ${res.status} を返しました: ${await res.text()}`,
			);
		}
		return (await res.json()) as T;
	}

	async list(dir: string): Promise<string[]> {
		try {
			const entries = await this.api<{ name: string; type: string }[]>(
				`/contents/${assertSafePath(dir)}?ref=${this.config.branch}`,
			);
			return entries
				.filter((e) => e.type === "file")
				.map((e) => e.name)
				.sort();
		} catch {
			return [];
		}
	}

	async read(filePath: string): Promise<string | null> {
		try {
			const file = await this.api<{ content: string; encoding: string }>(
				`/contents/${assertSafePath(filePath)}?ref=${this.config.branch}`,
			);
			if (file.encoding !== "base64") return null;
			return Buffer.from(file.content, "base64").toString("utf-8");
		} catch {
			return null;
		}
	}

	// 記事本文と画像をまとめて1コミットにしたいので Git Data API を使う
	async commit(changes: FileChange[], message: string): Promise<CommitResult> {
		const { branch } = this.config;
		const ref = await this.api<{ object: { sha: string } }>(
			`/git/ref/heads/${branch}`,
		);
		const parentSha = ref.object.sha;
		const parent = await this.api<{ tree: { sha: string } }>(
			`/git/commits/${parentSha}`,
		);

		const tree = await Promise.all(
			changes.map(async (change) => {
				const filePath = assertSafePath(change.path);
				if ("deleted" in change) {
					return {
						path: filePath,
						mode: "100644",
						type: "blob",
						sha: null,
					};
				}
				const blob = await this.api<{ sha: string }>("/git/blobs", {
					method: "POST",
					body: {
						content: changeToBuffer(change).toString("base64"),
						encoding: "base64",
					},
				});
				return {
					path: filePath,
					mode: "100644",
					type: "blob",
					sha: blob.sha,
				};
			}),
		);

		const newTree = await this.api<{ sha: string }>("/git/trees", {
			method: "POST",
			body: { base_tree: parent.tree.sha, tree },
		});
		const commit = await this.api<{ sha: string; html_url: string }>(
			"/git/commits",
			{
				method: "POST",
				body: { message, tree: newTree.sha, parents: [parentSha] },
			},
		);
		await this.api(`/git/refs/heads/${branch}`, {
			method: "PATCH",
			body: { sha: commit.sha },
		});
		return { committed: true, url: commit.html_url };
	}
}

export async function getContentStore(): Promise<ContentStore> {
	const token = process.env.GITHUB_TOKEN;
	const repo = process.env.GITHUB_REPOSITORY;
	const useGitHub =
		process.env.ADMIN_STORE === "github" ||
		(process.env.ADMIN_STORE !== "fs" && Boolean(token && repo));

	if (!useGitHub) {
		if (process.env.NODE_ENV === "production") {
			throw new Error(
				"本番では GITHUB_TOKEN と GITHUB_REPOSITORY を設定してください (サーバーのファイルシステムは使い捨てのため保存が消えます)",
			);
		}
		const { FsStore } = await import("./store-fs");
		return new FsStore();
	}
	if (!token || !repo) {
		throw new Error(
			"GitHub に保存するには GITHUB_TOKEN と GITHUB_REPOSITORY が必要です",
		);
	}
	return new GitHubStore({
		token,
		repo,
		branch: process.env.GITHUB_BRANCH ?? "main",
	});
}
