import { App, TFile } from "obsidian";

export class Detector{

    public getActiveFolder(app: App): string {

        const activeFile = app.workspace.getActiveFile();

        if (activeFile && activeFile instanceof TFile) { 
            
            return activeFile.parent?.path || "";

        }

        return "";
    }

}