#!/usr/bin/env node
export * from './src/index.mjs';
import { cli } from './src/index.mjs';

await cli({ moduleUrl: import.meta.url, argv: process.argv.slice(2) });
