import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface TranslationFile {
  [key: string]: string | TranslationFile;
}

function isObject(value: any): value is TranslationFile {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractKeys(obj: TranslationFile, prefix = ''): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (isObject(value)) {
      keys.push(...extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

function generateTypeFromKeys(keys: string[], typeName: string): string {
  const quotedKeys = keys.map((key) => `'${key}'`).join(' | ');
  return `export type ${typeName} = ${quotedKeys};`;
}

function generateTypesFromTranslations(): void {
  const localesDir = join(process.cwd(), 'assets/locales');
  const namespaces = ['common', 'errors', 'validation', 'messages'];

  try {
    // Read the first available language directory (assuming all have same structure)
    const langDirs = readdirSync(localesDir).filter((dir) =>
      statSync(join(localesDir, dir)).isDirectory()
    );

    if (langDirs.length === 0) {
      console.log('No language directories found');
      return;
    }

    const firstLang = langDirs[0];
    const typeDefinitions: string[] = [];

    // Generate types for each namespace
    for (const namespace of namespaces) {
      const filePath = join(localesDir, firstLang, `${namespace}.json`);

      try {
        const content = readFileSync(filePath, 'utf-8');
        const translations: TranslationFile = JSON.parse(content);
        const keys = extractKeys(translations);

        // Convert keys to TypeScript type
        const typeName = `${
          namespace.charAt(0).toUpperCase() + namespace.slice(1)
        }Keys`;
        const typeDefinition = generateTypeFromKeys(keys, typeName);
        typeDefinitions.push(typeDefinition);

        console.log(`Generated ${typeName} with ${keys.length} keys`);
      } catch (error) {
        console.warn(`Could not process ${namespace}.json:`, error);
      }
    }

    // Generate the complete types file
    const typesContent = `// Auto-generated types from translation files
// Run: bun run src/shared/i18n/generate-types.ts

${typeDefinitions.join('\n\n')}

// Combined type for all translation keys
export type AllTranslationKeysWithNs = 
${typeDefinitions
  .map((_, index) => {
    const namespace = namespaces[index];
    const typeName = `${
      namespace.charAt(0).toUpperCase() + namespace.slice(1)
    }Keys`;
    return `  | \`${namespace}:\${${typeName}}\``;
  })
  .join('\n')};

// All translation keys
export type AllTranslationKeys =
${typeDefinitions
  .map((_, index) => {
    const namespace = namespaces[index];
    const typeName = `${
      namespace.charAt(0).toUpperCase() + namespace.slice(1)
    }Keys`;
    return `  | ${typeName}`;
  })
  .join('\n')};

// Namespace type
export type Namespace = ${namespaces.map((ns) => `'${ns}'`).join(' | ')};

// Context types for interpolation
export interface CommonContext {
  name?: string;
}

export interface ValidationContext {
  min?: number;
  max?: number;
  types?: string;
}

export interface MessageContext {
  [key: string]: unknown;
}

export interface ErrorsContext {
  [key: string]: unknown;
}


export type TranslationContext = CommonContext | ValidationContext | MessageContext | ErrorsContext;
`;

    // Write the types file
    const typesFilePath = join(
      process.cwd(),
      'src/shared/i18n/generated-types.ts'
    );
    writeFileSync(typesFilePath, typesContent);

    console.log(`✅ Types generated successfully at ${typesFilePath}`);
  } catch (error) {
    console.error('Error generating types:', error);
  }
}

// Run the generator
if (import.meta.main) {
  generateTypesFromTranslations();
}

export { generateTypesFromTranslations };
