import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function extractGitModuleType() {
  const gitModulePath = path.resolve(__dirname, "../src/core/modules/git.ts");
  const content = await fs.readFile(gitModulePath, "utf-8");

  // Extract the GitRepositoryInfo interface using regex
  const interfaceMatch = content.match(/interface\s+GitRepositoryInfo\s*\{([^}]+)\}/);

  if (!interfaceMatch || !interfaceMatch[1]) {
    throw new Error("Could not find GitRepositoryInfo interface in git.ts");
  }

  const interfaceContent = interfaceMatch[1].trim();

  // Parse the interface properties
  const propertyLines = interfaceContent.split("\n");
  const gitInfoTypes = {};

  for (const line of propertyLines) {
    // Match property name and type, accounting for optional properties (?) and comments
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const propertyMatch = line.match(/^\s*(\w+)\??:\s*([^;/]+);?\s*(\/\/.*)?$/);
    if (propertyMatch) {
      const [, propertyName, propertyType] = propertyMatch;
      // Convert optional properties to use "| null" in the output type
      gitInfoTypes[propertyName] = propertyType.trim() + (line.includes("?") ? " | null" : "");
    }
  }

  return gitInfoTypes;
}

async function extractRuntimeModuleType() {
  const runtimeModulePath = path.resolve(__dirname, "../src/core/modules/runtime.ts");
  const content = await fs.readFile(runtimeModulePath, "utf-8");

  // Extract the GitRepositoryInfo interface using regex
  const interfaceMatch = content.match(/interface\s+RuntimeInfo\s*\{([^}]+)\}/);

  if (!interfaceMatch || !interfaceMatch[1]) {
    throw new Error("Could not find RuntimeInfo interface in git.ts");
  }

  const interfaceContent = interfaceMatch[1].trim();

  // Parse the interface properties
  const propertyLines = interfaceContent.split("\n");
  const gitInfoTypes = {};

  for (const line of propertyLines) {
    // Match property name and type, accounting for optional properties (?) and comments
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const propertyMatch = line.match(/^\s*(\w+)\??:\s*([^;/]+);?\s*(\/\/.*)?$/);
    if (propertyMatch) {
      const [, propertyName, propertyType] = propertyMatch;
      // Convert optional properties to use "| null" in the output type
      gitInfoTypes[propertyName] = propertyType.trim() + (line.includes("?") ? " | null" : "");
    }
  }

  return gitInfoTypes;
}

async function generateGitModuleTypings() {
  try {
    const gitInfoTypes = await extractGitModuleType();
    const runtimeInfoTypes = await extractRuntimeModuleType();

    const typesDir = path.resolve(__dirname, "../types");
    await fs.mkdir(typesDir, { recursive: true });

    // Generate the d.ts content
    async function writeModuleTypes(name, types) {
      const content = `// Auto-generated type definitions for unplugin-build-meta git module
      // Do not edit manually!

declare module 'virtual:build-meta/${name}' {
  ${Object.entries(types)
    .map(([key, type]) => `declare const ${key}: ${type};`)
    .join("\n  ")}
}
      `;

      // write the d.ts file
      await fs.writeFile(path.join(typesDir, `${name}.d.ts`), content, "utf-8");
    }

    writeModuleTypes("git", gitInfoTypes);
    writeModuleTypes("runtime", runtimeInfoTypes);

    // Create or update the index.d.ts file that re-exports all types
    const indexContent = `// Auto-generated type definitions for unplugin-build-meta
// Do not edit manually!

import './git';
import './runtime';
`;

    await fs.writeFile(path.join(typesDir, "index.d.ts"), indexContent, "utf-8");

    console.log("Generated git module type definitions successfully!");
  } catch (error) {
    console.error("Error generating git module type definitions:", error);
  }
}

// Execute the function
generateGitModuleTypings();
