import { Plugin, TFolder } from "obsidian";
import { CreationModal } from "./modal/CreationModal";
import { Detector } from "processing/Detector";

// Remember to rename these classes and interfaces!

export default class MassCreatePlugin extends Plugin {
	folderPath: string;

	async onload() {
		this.addCommand({
			id: "display-creation-modal",
			name: "Note creator",
			callback: () => {
				new CreationModal(this.app, new Detector().getActiveFolder(this.app)).open();
			},
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, folder) => {
				if (folder && folder instanceof TFolder) {
					menu.addItem((item) => {
						item.setTitle("Mass create notes")
							.setIcon("plus")
							.onClick(async () => {
								this.folderPath = folder.path;
								new CreationModal(
									this.app,
									this.folderPath
								).open();
							});
					});
				}
			})
		);
	}

	onunload() {}
}