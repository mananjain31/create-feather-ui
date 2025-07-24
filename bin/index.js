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
  `cd ${appName} && npm install -D tailwindcss@3.4.1 postcss autoprefixer && npx tailwindcss init -p`,
  { stdio: "inherit" }
);
execSync(`cd ${appName} && npm install @mananjain31/feather-ui`, {
  stdio: "inherit",
});

// Replace config and CSS
const tailwindCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

fs.writeFileSync(`${appPath}/src/index.css`, tailwindCSS);

const tailwindConfig = `
module.exports = {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
     "./node_modules/@mananjain31/feather-ui/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: { extend: {} },
  plugins: [],
}
`;
fs.writeFileSync(`${appPath}/tailwind.config.js`, tailwindConfig);

// Replace App.tsx
const demoApp = `
import { Button } from "@mananjain31/feather-ui";

function App() {
  return (
    <div className="p-8">
      <Button variant="primary">Hello from FeatherUI!</Button>
    </div>
  );
}

export default App;
`;
fs.writeFileSync(`${appPath}/src/App.tsx`, demoApp);

console.log(`✅ All set! Now run:
cd ${appName}
npm run dev
`);
