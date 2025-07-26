#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const appName = process.argv[2];

if (!appName) {
  console.error("❌ Please provide a project name: `npx featherui-cli my-app`");
  process.exit(1);
}

console.log(`✨ Creating FeatherUI app: ${appName}...`);

execSync(`npx create-vite@latest ${appName} --template react-ts`, {
  stdio: "inherit",
});

const appPath = path.join(process.cwd(), appName);

// Install Tailwind and your library
console.log("📦 Installing dependencies...");
execSync(
  `cd ${appName} && npm install -D tailwindcss@3 postcss autoprefixer && npx tailwindcss init -p`,
  { stdio: "inherit" }
);
execSync(`cd ${appName} && npm install @mananjain31/feather-ui`, {
  stdio: "inherit",
});

// Replace config and CSS
const tailwindCSS = `@import "@mananjain31/feather-ui/styles.css"`;

fs.writeFileSync(`${appPath}/src/index.css`, tailwindCSS);

const tailwindConfig = `
const featherPreset = require("@mananjain31/feather-ui/tailwind.preset");

export default {
  presets: [featherPreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@mananjain31/feather-ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

`;
fs.writeFileSync(`${appPath}/tailwind.config.js`, tailwindConfig);

// Replace App.tsx
const demoApp = `
import { Button } from "@mananjain31/feather-ui";

function App() {
  return (
    <>
      <div className="flex gap-2 mx-6 my-4">
        <Button>Hello from FeatherUI!</Button>
      </div>
    </>
  );
}

export default App;
`;
fs.writeFileSync(`${appPath}/src/App.tsx`, demoApp);

console.log(`✅ All set! Now run:
cd ${appName}
npm run dev
`);
