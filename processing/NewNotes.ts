import { App, normalizePath, TFile } from "obsidian";

export class NewNotes {
	async createBulkNotes(
		note: string,
		path: string,
		app: App,
		contentPath: string
	) {
		const normalizedPath = normalizePath(path);
		const folder = app.vault.getAbstractFileByPath(normalizedPath);
		if (!folder) {
			app.vault.createFolder(normalizedPath);
		}
		if (contentPath == "") {
			app.vault.create(path + "/" + note + ".md", "");
		} else {
			const normalizedPath = normalizePath(contentPath);

			const templateFile =
				app.vault.getAbstractFileByPath(normalizedPath);

			if (templateFile && templateFile instanceof TFile) {
				const content = await app.vault.read(templateFile);
				app.vault.create(path + "/" + note + ".md", content);
			}
		}
	}
}
