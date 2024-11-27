import { Plugin, TFolder } from "obsidian";
import { CreationModal } from "./modal/CreationModal";

// Remember to rename these classes and interfaces!

export default class MassCreatePlugin extends Plugin {
	folderPath: string;

	async onload() {
		this.addCommand({
			id: "display-creation-modal",
			name: "Note creator",
			callback: () => {
				new CreationModal(this.app, "").open();
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
