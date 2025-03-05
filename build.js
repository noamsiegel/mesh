#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';

// Read the supergraph schema
console.log('Reading supergraph schema...');
const supergraphSchema = fs.readFileSync('./supergraph.graphql', 'utf-8');

// Properly escape the schema for JavaScript string literals
// This handles backticks, newlines, and other special characters
const escapedSchema = JSON.stringify(supergraphSchema);

// Read the worker.ts file
console.log('Reading worker.ts file...');
let workerContent = fs.readFileSync('./worker.ts', 'utf-8');

// Replace the placeholder schema with the actual schema
// Using JSON.stringify ensures proper escaping of all special characters
console.log('Injecting schema into worker.ts...');
workerContent = workerContent.replace(
//   /const supergraphSchema = process\.env\.SUPERGRAPH_SCHEMA \|\| `[\s\S]*?`;/,
  `const supergraphSchema = process.env.SUPERGRAPH_SCHEMA || ${escapedSchema};`
);

// Write the updated worker.ts file to a temporary file
console.log('Writing updated worker.ts file...');
fs.writeFileSync('./worker.build.ts', workerContent);

console.log('Build script completed successfully!'); 