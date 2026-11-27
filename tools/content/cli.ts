// CLI entry points for the three content scripts (content-toolchain.md §3–§5).
// Node runs this TypeScript file directly; no runtime or build-time YAML
// parsing happens in the shipped site.

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import nodePath from 'node:path';
import process from 'node:process';
import type {
  CardFile,
  CardSet,
  ContentIo,
  Finding,
  ValidationOptions,
} from './contracts.ts';
import { parseCardSet } from './schema.ts';
import { topicHeadings } from './gates/common.ts';
import { generateContent } from './generate.ts';
import { scaffoldArea } from './scaffold.ts';
import { validateCommand } from './validate.ts';

const ROOT = process.cwd();
const CONTENT_ROOT = nodePath.join(ROOT, 'docs', 'content');
const COVERAGE_PATH = nodePath.join(ROOT, 'docs', 'coverage', 'COVERAGE.md');

function yamlFiles(directory: string, prefix: string): readonly string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) {
      return yamlFiles(nodePath.join(directory, entry.name), `${relative}/`);
    }
    return entry.name.endsWith('.yaml') ? relative : [];
  });
}

function diskIo(): ContentIo {
  return {
    readFile(path: string): string | undefined {
      const full = nodePath.join(CONTENT_ROOT, path);
      return existsSync(full) ? readFileSync(full, 'utf8') : undefined;
    },
    writeFile(path: string, text: string): void {
      const full = nodePath.join(CONTENT_ROOT, path);
      mkdirSync(nodePath.dirname(full), { recursive: true });
      writeFileSync(full, text, 'utf8');
    },
    listFiles(prefix: string): readonly string[] {
      return yamlFiles(CONTENT_ROOT, '').filter((path) =>
        path.startsWith(prefix),
      );
    },
    exists(path: string): boolean {
      return existsSync(nodePath.join(CONTENT_ROOT, path));
    },
  };
}

function readCards(): CardSet {
  const io = diskIo();
  const files: CardFile[] = io.listFiles('').flatMap((path) => {
    const text = io.readFile(path);
    return text === undefined ? [] : { path, text };
  });
  return { files };
}

// Spec-topic IDs come from the coverage headings at authoring time only.
// Missing coverage is reported as an unchecked gap, never silently passed.
function coverageOptions(): ValidationOptions {
  if (!existsSync(COVERAGE_PATH)) {
    return {
      topicOverlap: true,
      uncheckedClauses: ['coverage-topic-headings'],
    };
  }
  const headings = topicHeadings(readFileSync(COVERAGE_PATH, 'utf8'));
  return headings.length === 0
    ? { topicOverlap: true, uncheckedClauses: ['coverage-topic-headings'] }
    : { topicOverlap: true, coverageHeadings: headings };
}

function printFindings(findings: readonly Finding[]): void {
  for (const finding of findings) {
    process.stdout.write(
      `${finding.path}:${finding.entry} — ${finding.message} — ${finding.gate}\n`,
    );
  }
}

function worldOption(areaId: string, argv: readonly string[]) {
  const worldIndex = argv.indexOf('--world');
  const startIndex = argv.indexOf('--start-area');
  const id = worldIndex === -1 ? `world-${areaId}` : argv[worldIndex + 1];
  const startAreaId =
    startIndex === -1 ? `area-${areaId}` : argv[startIndex + 1];
  return id === undefined || startAreaId === undefined
    ? undefined
    : { id, startAreaId };
}

function main(): void {
  const [command, areaId, ...flags] = process.argv.slice(2);
  if (command === 'validate') {
    const result = validateCommand(readCards(), coverageOptions());
    printFindings(result.findings);
    process.exitCode = result.exitCode;
    return;
  }
  if (command === 'scaffold') {
    if (areaId === undefined || areaId.length === 0) {
      process.stderr.write('usage: content:scaffold -- <area-id> [--force]\n');
      process.exitCode = 1;
      return;
    }
    const result = scaffoldArea(
      areaId,
      { force: flags.includes('--force'), world: worldOption(areaId, flags) },
      diskIo(),
    );
    process.stdout.write(
      `written: ${result.written.join(', ') || 'none'}\nrefused: ${result.refused.join(', ') || 'none'}\n`,
    );
    return;
  }
  if (command === 'generate') {
    const parsed = parseCardSet(readCards());
    if (parsed.findings.length > 0) {
      printFindings(parsed.findings);
      process.exitCode = 1;
      return;
    }
    const options = coverageOptions();
    const result = generateContent(
      {
        cards: Object.entries(parsed.parsed).map(([path, data]) => ({
          path,
          data,
        })),
      },
      options,
    );
    if (!result.ok) {
      printFindings(result.findings);
      process.exitCode = 1;
      return;
    }
    for (const file of result.files) {
      const full = nodePath.join(ROOT, file.path);
      mkdirSync(nodePath.dirname(full), { recursive: true });
      writeFileSync(full, file.text, 'utf8');
    }
    process.stdout.write(`generated ${String(result.files.length)} files\n`);
    return;
  }
  process.stderr.write(
    'usage: content:validate | content:scaffold | content:generate\n',
  );
  process.exitCode = 1;
}

main();
