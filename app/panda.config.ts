import { defineConfig, defineGlobalStyles } from '@pandacss/dev'
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
    '@pandacss/preset-base',
    createPreset({
      accentColor: 'neutral',
      grayColor: 'sage',
      borderRadius: 'md',
    }),
  ],
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],
  exclude: [],

  theme: {
    extend: {
    tokens: {
      colors: {
        text: { value: "#333" },
        background: { value: "#fff" },
        primary: { value: "#0070f3" },
        secondary: { value: "#1c1c1e" },
      },
      fonts: {
        body: { value: "Inter, sans-serif" },
      },
    },
  },
},
  globalCss,
  
  jsxFramework: 'react',
  outdir: 'styled-system',
})
