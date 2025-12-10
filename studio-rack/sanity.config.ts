import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
// Uncomment to enable code blocks (requires: npm install @sanity/code-input)
// import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'rack-studio',
  title: 'Rack Blog Studio',

  projectId: 'lj9mp7qf',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    // codeInput(), // Uncomment to enable code blocks
  ],

  schema: {
    types: schemaTypes,
  },
});
