---
type: "query"
date: "2026-11-24T12:48:53.315552+00:00"
question: "Where are the ESLint flat config, NPM scripts, strict compilerOptions and Vite base configured?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["eslint.config.js", "scripts", "compilerOptions", "vite.config.ts"]
---

# Q: Where are the ESLint flat config, NPM scripts, strict compilerOptions and Vite base configured?

## Answer

eslint.config.js imports js, unicorn, sonarjs and globals at L1-L4; package.json scripts at L7 with lint at L12; tsconfig.json compilerOptions at L2; vite.config.ts at L1 sets base '/CompSciQuest/'.

## Outcome

- Signal: useful

## Source Nodes

- eslint.config.js
- scripts
- compilerOptions
- vite.config.ts