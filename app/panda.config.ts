import { defineConfig, defineGlobalStyles, type Preset } from "@pandacss/dev";
import { createPreset } from '@park-ui/panda-preset'

const globalCss = defineGlobalStyles({
  "html, body": {
    margin: 0,
    padding: 0,
    fontFamily: "Inter, sans-serif",
    color: "var(--colors-text)",
    backgroundColor: "var(--colors-background)",
  },
  "*": {
    boxSizing: "border-box",
  },
  a: {
    textDecoration: "none",
    color: "inherit",
  },
  button: {
    fontFamily: "inherit",
  },
});


export default defineConfig({
  preflight: true,
  presets: [
    "@pandacss/preset-base",
    createPreset({
      accentColor: "neutral",
      grayColor: "sage",
      borderRadius: "md",
    }) as Preset,
  ],
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  exclude: [],

  theme: {
    semanticTokens: {
      colors: {
        ui: {
          text: {
            DEFAULT: {
              value: { base: "#333", _dark: "#fff" },
            },
            secondary: {
              value: { base: "#333", _dark: "#fff" },
            },
          },
          background: {
            DEFAULT: {
              value: { base: "lightgray", _dark: "#1c1c1e" },
            },
            secondary: {
              value: { base: "#fff", _dark: "#1c1c1e" },
            },
          },
          primary: {
            DEFAULT: {
              value: { base: "#0070f3", _dark: "#0070f3" },
            },
            secondary: {
              value: { base: "#0070f3", dark: "#0070f3" },
            },
          },
          secondary: {
            DEFAULT: {
              value: { base: "#1c1c1e", _dark: "#1c1c1e" },
            },
            secondary: {
              value: { base: "#1c1c1e", _dark: "#1c1c1e" },
            },
          },
        },
      },
    },
  },
  globalCss,

  jsxFramework: "react",
  outdir: "styled-system",
});
