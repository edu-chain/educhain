export type FrameworkJS = {
  label: string;
  value: frameworkJS
  disabled?: boolean;
};

export type FrameworkCSS = {
  label: string;
  value: frameworkCSS
  disabled?: boolean;
};

export type Headless = {
  label: string;
  value: headlessLib
  disabled?: boolean;
};

export type Component = {
  label: string;
  value: componentLib
  disabled?: boolean;
};

export type Plugin = {
  name: string;
  family: string;
  description: string;
  image: string;
  rating: number;
};

export interface ProjectFile {
  path: string;
  content: string;
  fileType?: string; // optional, could be useful for syntax highlighting or file type-specific operations
}

export type PluginsFamillies =
  | "Auth"
  | "Database"
  | "Data_fetching"
  | "Storage"
  | "Analytics"
  | "CRM"
  | "Marketing"
  | "Content"
  | "Translation"
  | "Other";

export type frameworkJS =
  | "react"
  | "next"
  | "remix"
  | "svelte"
  | "vue"
  | "solid"
  | "";
export type frameworkCSS = "pandacss" | "tailwindcss" | "";
export type headlessLib = "arkui" | "radixui" | "";
export type componentLib = "parkui" | "shadcn/ui" | "mui" | "joyui" | "chakraui" | "";

export type TechStack = {
  frameworkJS: frameworkJS;
  frameworkCSS: frameworkCSS;
  headless: headlessLib;
  componentLib: componentLib;
};

export const frameworksJS: FrameworkJS[] = [
  { label: "React", value: "react" },
  { label: "NextJS", value: "next" },
  { label: "Remix", value: "remix" },
  { label: "Solid", value: "solid", disabled: true },
  { label: "Svelte", value: "svelte", disabled: true },
  { label: "Vue", value: "vue", disabled: true },
];

export const headless: Headless[] = [
  { label: "ArkUI ", value: "arkui" },
  { label: "radixUI", value: "radixui", disabled: true },
];

export const frameworksCSS: FrameworkCSS[] = [
  { label: "Tailwind ", value: "tailwindcss" },
  { label: "PandaCSS", value: "pandacss" },
];

export const components: Component[] = [
  { label: "ParkUI", value: "parkui" },
  { label: "shadcn/ui", value: "shadcn/ui", disabled: true },
  { label: "MUI", value: "mui", disabled: true },
  { label: "JoyUI", value: "joyui", disabled: true },
  { label: "ChakraUI", value: "chakraui", disabled: true },
];
