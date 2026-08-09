import fs from "node:fs/promises";
import path from "node:path";
import {
	type CommitResult,
	type ContentStore,
	type FileChange,
	assertSafePath,
	changeToBuffer,
} from "./store";

/**
 * ローカル開発用。リポジトリのファイルを直接書き換えるので、
 * 保存した結果がそのまま git の作業ツリーに出る。
 *
 * このモジュールは開発時にしか読み込まない。`process.cwd()` を使った動的な
 * ファイルアクセスがあると、Turbopack がプロジェクト全体を serverless function
 * に同梱してしまうため。
 */
export class FsStore implements ContentStore {
	readonly kind = "fs" as const;

	private abs(filePath: string): string {
		return path.join(process.cwd(), assertSafePath(filePath));
	}

	async list(dir: string): Promise<string[]> {
		try {
			return (await fs.readdir(this.abs(dir))).sort();
		} catch {
			return [];
		}
	}

	async read(filePath: string): Promise<string | null> {
		try {
			return await fs.readFile(this.abs(filePath), "utf-8");
		} catch {
			return null;
		}
	}

	async commit(changes: FileChange[]): Promise<CommitResult> {
		for (const change of changes) {
			const target = this.abs(change.path);
			if ("deleted" in change) {
				await fs.rm(target, { force: true });
				continue;
			}
			await fs.mkdir(path.dirname(target), { recursive: true });
			await fs.writeFile(target, changeToBuffer(change));
		}
		return { committed: false };
	}
}
