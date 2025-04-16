import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function extractGitInfoInterface() {
  const gitModulePath = path.resolve(__dirname, "../src/core/modules/git.ts");
  const content = await fs.readFile(gitModulePath, "utf-8");

  // Extract the GitInfo interface using regex
  const interfaceMatch = content.match(/interface\s+GitInfo\s*\{([^}]+)\}/);

  if (!interfaceMatch || !interfaceMatch[1]) {
    throw new Error("Could not find GitInfo interface in git.ts");
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
    // Dynamically extract GitInfo interface from the source file
    const gitInfoTypes = await extractGitInfoInterface();

    // Generate the d.ts content
    const content = `// Auto-generated type definitions for unplugin-build-meta git module
// Do not edit manually!

declare module 'virtual:build-meta/git' {
  ${Object.entries(gitInfoTypes)
    .map(([key, type]) => `export const ${key}: ${type};`)
    .join("\n  ")}
}
`;

    const typesDir = path.resolve(__dirname, "../types");

    // Create the types directory if it doesn't exist
    await fs.mkdir(typesDir, { recursive: true });

    // Write the d.ts file
    await fs.writeFile(path.join(typesDir, "git.d.ts"), content, "utf-8");

    // Create or update the index.d.ts file that re-exports all types
    const indexContent = `// Auto-generated type definitions for unplugin-build-meta
// Do not edit manually!

// Re-export git module types
import './git';
`;

    await fs.writeFile(path.join(typesDir, "index.d.ts"), indexContent, "utf-8");

    console.log("Generated git module type definitions successfully!");
  } catch (error) {
    console.error("Error generating git module type definitions:", error);
  }
}

// Execute the function
generateGitModuleTypings();
