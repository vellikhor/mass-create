import { App, Modal, Setting, Notice } from "obsidian";
import { NewNotes } from "processing/NewNotes";

export class CreationModal extends Modal {
	isFolderCreating: boolean;
	usingTemplate: boolean;
	path: string;
	textAreaNames: string;
	folderName: string;
	templatePath: string;
	constructor(app: App, path: string) {
		super(app);
		this.isFolderCreating = false;
		this.path = path;
		this.templatePath = "";
	}
	onOpen() {
		this.display();
	}
	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}

	display(): void {
		let { contentEl } = this;

		this.contentEl.empty();

		this.add_create_title(contentEl);
		this.add_create_folder(contentEl);
		this.add_add_note_names(contentEl);
		this.add_use_template(contentEl);
		if (this.usingTemplate) {
			this.add_template_path(contentEl);
		}
		this.add_create_button(contentEl);
	}

	add_create_title(contentEl: HTMLElement): void {
		contentEl.createEl("h1", { text: "Mass create notes" });
	}

	add_create_folder(contentEl: HTMLElement): void {
		new Setting(contentEl)
			.addText((text) =>
				text
					.setValue(this.folderName)
					.setPlaceholder("Folder name")
					.setDisabled(!this.isFolderCreating)
					.onChange((folderName) => {
						this.folderName = folderName;
					})
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.isFolderCreating)
					.onChange((isFolderCreating) => {
						this.isFolderCreating = isFolderCreating;
						this.folderName = "";
						this.display();
					});
			})
			.setName("Create folder")
			.setDesc("Creates optional folder for files.");
	}

	add_add_note_names(contentEl: HTMLElement) {
		new Setting(contentEl)
			.addTextArea((text) => {
				const t = text
					.setValue(this.textAreaNames)
					.setPlaceholder("Note names")
					.onChange((value) => {
						this.textAreaNames = value;
					});
				t.inputEl.setAttr("rows", 13);
				t.inputEl.setAttr("cols", 65);
			})
			.setName("Note names")
			.setDesc("List each note on its own line.");
	}

	add_use_template(contentEl: HTMLElement) {
		new Setting(contentEl).setName("Use template?").addToggle((cb) => {
			cb.setValue(this.usingTemplate).onChange((usingTemplate) => {
				this.usingTemplate = usingTemplate;
				this.display();
				this.templatePath = "";
			});
		});
	}

	add_template_path(contentEl: HTMLElement): void {
		new Setting(contentEl)
			.setName("Template path:")
			.setDesc("Path from template folder.")
			.addText((text) => {
				text.setPlaceholder("Path/Note.md").onChange((templatePath) => {
					this.templatePath = templatePath;
				})
				.setValue(this.templatePath);
			});
	}

	add_create_button(contentEl: HTMLElement): void {
		new Setting(contentEl).addButton((btn) => {
			btn.setButtonText("Create")
				.setCta()
				.onClick(() => {
					this.close();
					this.display_names();
					const notesList: string[] = this.textAreaNames.split("\n");
					for (let i = 0; i < notesList.length; i++) {
						if (this.usingTemplate) {
							new NewNotes().createBulkNotes(
								notesList[i],
								this.path + "/" + this.folderName,
								this.app,
								this.templatePath
							);
						} else {
							new NewNotes().createBulkNotes(
								notesList[i],
								this.path + "/" + this.folderName,
								this.app,
								""
							);
						}
					}
				});
		});
	}

	display_names(): void {
		const annNames: string[] = this.textAreaNames.split("\n");
		let output: string = "";
		for (let i = 0; i < 5 && i < annNames.length; i++) {
			output += annNames[i] + "\n";
		}
		if (annNames.length > 5) {
			output +=
				"and " + (annNames.length - 5) + " more have been created.";
		} else {
			output += "notes have been created.";
		}
		new Notice(output);
	}
}
