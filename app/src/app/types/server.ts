import { Document } from "mongoose";

export interface ITechItem extends Document {
  _id?: string;
  name: string;
  type: "frameworkJS" | "frameworkCSS" | "headless" | "componentLib" | "plugin";
  actions: ScriptAction[];
  files: ProjectFile[];
}

export interface TechItem {
  _id?: string;
  name: string;
  type: "frameworkJS" | "frameworkCSS" | "headless" | "componentLib";
  actions: ScriptAction[];
  files: ProjectFile[];
}

export interface Plugin {
  _id?: string;
  name: string;
  family: string;
  actions: ScriptAction[];
  files: ProjectFile[];
}

export interface ScriptAction {
  type: "install" | "executeCommand";
  payload: string;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export interface UserProject {
  _id?: string;
  userId: string;
  repoName: string;
  techStack: {
    frameworkJS: string;
    frameworkCSS: string;
    headless: string;
    componentLib: string;
  };
  plugins: string[];
  createdAt: Date;
  updatedAt: Date;
}
