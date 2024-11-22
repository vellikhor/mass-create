import { Plugin, TFolder } from "obsidian";
import { CreationModal } from "./modal/CreationModal";

// Remember to rename these classes and interfaces!

export default class MassCreatePlugin extends Plugin {
	folderPath: string;

	async onload() {
		this.addCommand({
			id: "display-creation-modal",
			name: "Bulk Creation Modal",
			callback: () => {
				new CreationModal(this.app, "Hi").open();
			},
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, folder) => {
				if (folder && folder instanceof TFolder) {
					menu.addItem((item) => {
						item.setTitle("Mass Create Notes")
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

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}
}
