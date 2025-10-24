// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        ignores: ["dist/", "node_modules/"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.json",
            },
            globals: {
                Bun: "readonly",
            },
        },

        rules: {
            "@typescript-eslint/no-unused-vars": ["warn"]
        },
    }
);