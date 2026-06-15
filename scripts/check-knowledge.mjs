#!/usr/bin/env node
// scripts/check-knowledge.mjs
//
// Static validator for the CV_KNOWLEDGE array. Catches placeholder text,
// duplicate titles, missing required fields, and bad enum values before
// the build ever runs. Wired into `npm run check:knowledge`.
//
// Exit code: 0 = clean, 1 = violations found.

import {
  CV_KNOWLEDGE,
  CV_KNOWLEDGE_VERSION,
} from '../src/lib/cv-knowledge-data.mjs';

const VALID_SECTIONS = new Set([
  'profile',
  'work',
  'project',
  'skills',
  'blog',
  'education',
  'achievements',
  'faq',
  'contact',
]);

const VALID_AUDIENCES = new Set(['recruiter', 'technical', 'general']);

const PLACEHOLDER_PATTERNS = [
  /\bTBD\b/i,
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /\bXXX\b/i,
  /lorem ipsum/i,
  /placeholder/i,
  /\bn\.?a\.?\b/i, // n/a / N/A / NA
  /\bunknown\b/i,
];

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function isValidUrl(url) {
  if (!url) return true;
  return url.startsWith('/') || url.startsWith('http');
}

// ── Aggregate stats ────────────────────────────────────────────
const bySection = new Map();
for (const entry of CV_KNOWLEDGE) {
  bySection.set(entry.section, (bySection.get(entry.section) ?? 0) + 1);
}

// ── Validate ───────────────────────────────────────────────────
const titlesSeen = new Map(); // title -> first index
const urlsSeen = new Map(); // url -> count

CV_KNOWLEDGE.forEach((entry, idx) => {
  const ctx = `entry #${idx + 1} "${entry.title ?? '(untitled)'}"`;

  if (!entry.title || !entry.title.trim()) {
    fail(`${ctx}: missing title`);
  } else if (titlesSeen.has(entry.title)) {
    fail(`${ctx}: duplicate title (first seen at #${titlesSeen.get(entry.title) + 1})`);
  } else {
    titlesSeen.set(entry.title, idx);
  }

  if (!entry.section) {
    fail(`${ctx}: missing section`);
  } else if (!VALID_SECTIONS.has(entry.section)) {
    fail(`${ctx}: invalid section "${entry.section}" (allowed: ${[...VALID_SECTIONS].join(', ')})`);
  }

  if (!entry.content || !entry.content.trim()) {
    fail(`${ctx}: missing content`);
  } else if (entry.content.length < 40) {
    warn(`${ctx}: content is only ${entry.content.length} chars — recruiters might want more detail`);
  }

  if (entry.url !== undefined && !isValidUrl(entry.url)) {
    fail(`${ctx}: url "${entry.url}" must start with "/" or be a full http(s) URL`);
  }
  if (entry.url) {
    urlsSeen.set(entry.url, (urlsSeen.get(entry.url) ?? 0) + 1);
  }

  if (entry.priority !== undefined) {
    if (typeof entry.priority !== 'number' || entry.priority < 1 || entry.priority > 5) {
      fail(`${ctx}: priority must be a number 1-5, got ${JSON.stringify(entry.priority)}`);
    }
  }

  if (entry.audience !== undefined) {
    if (!Array.isArray(entry.audience) || entry.audience.length === 0) {
      fail(`${ctx}: audience must be a non-empty array`);
    } else {
      for (const a of entry.audience) {
        if (!VALID_AUDIENCES.has(a)) {
          fail(`${ctx}: invalid audience "${a}" (allowed: ${[...VALID_AUDIENCES].join(', ')})`);
        }
      }
    }
  }

  if (entry.tags !== undefined && !Array.isArray(entry.tags)) {
    fail(`${ctx}: tags must be an array`);
  }

  if (entry.facts !== undefined && !Array.isArray(entry.facts)) {
    fail(`${ctx}: facts must be an array`);
  }

  if (entry.content) {
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(entry.content)) {
        fail(`${ctx}: content matches placeholder pattern ${pattern}`);
        break;
      }
      if (entry.title && pattern.test(entry.title)) {
        fail(`${ctx}: title matches placeholder pattern ${pattern}`);
        break;
      }
    }
  }
});

// ── Cross-entry checks ─────────────────────────────────────────
// Soft cap: warn if KB grows beyond what's reasonable to fit in a single
// prompt window (5 entries × ~400 tokens ≈ 2k tokens of context).
if (CV_KNOWLEDGE.length > 60) {
  warn(`KB has ${CV_KNOWLEDGE.length} entries — consider trimming; the retriever only uses top 5 per query`);
}

// Every project must have a `project` section. Sanity check.
const projectCount = bySection.get('project') ?? 0;
if (projectCount < 9) {
  warn(`Only ${projectCount} entries have section=project; resume-data.tsx lists 9 projects`);
}

// ── Report ─────────────────────────────────────────────────────
console.log(`CV_KNOWLEDGE v${CV_KNOWLEDGE_VERSION}`);
console.log(`Total entries: ${CV_KNOWLEDGE.length}`);
console.log('By section:');
for (const [section, count] of [...bySection.entries()].sort()) {
  console.log(`  ${section.padEnd(14)} ${count}`);
}
console.log(`Unique URLs: ${urlsSeen.size} (${urlsSeen.size === CV_KNOWLEDGE.length ? 'no duplicates' : 'duplicates exist'})`);

if (warnings.length > 0) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length > 0) {
  console.error(`\nErrors (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\n✗ check:knowledge failed.');
  process.exit(1);
}

console.log('\n✓ check:knowledge passed.');
