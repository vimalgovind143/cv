// Test suite for the CV chat prompt builder.
//
// Runs under bare `node --test`. Asserts the anti-injection clause, scope
// rules, source rendering, and priority ordering that chat.ts relies on.
//
//   node --test src/lib/cv-prompt.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPrompt,
  ANTI_INJECTION_CLAUSE,
  SYSTEM_RULES,
} from './cv-prompt.mjs';
import { findRelevantCvKnowledge } from './cv-knowledge-pure.mjs';
import { CV_KNOWLEDGE, CV_OUT_OF_SCOPE_MESSAGE } from './cv-knowledge-data.mjs';

// A small fake KB so tests don't depend on the full data file's ordering.
const FAKE_KB = [
  {
    title: 'Profile',
    section: 'profile',
    content: 'Vimal is a senior engineer in Bahrain.',
    url: '/',
    priority: 1,
  },
  {
    title: 'Flagship AI Project',
    section: 'project',
    content: 'Semantic Kernel ERP assistant with Azure OpenAI.',
    url: '/projects',
    priority: 5,
  },
];

// ─── structural invariants ─────────────────────────────────────
test('buildPrompt: opens with the anti-injection clause', () => {
  const prompt = buildPrompt('any question', FAKE_KB, CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(prompt.startsWith(ANTI_INJECTION_CLAUSE));
});

test('buildPrompt: every system rule is present and numbered', () => {
  const prompt = buildPrompt('q', FAKE_KB, CV_OUT_OF_SCOPE_MESSAGE);
  SYSTEM_RULES.forEach((rule, i) => {
    // Rule #3 carries the ${OUT_OF_SCOPE} placeholder before substitution.
    const expected = rule.replace('${OUT_OF_SCOPE}', CV_OUT_OF_SCOPE_MESSAGE);
    assert.ok(
      prompt.includes(`${i + 1}. ${expected}`),
      `missing rule ${i + 1}`,
    );
  });
});

test('buildPrompt: out-of-scope message is substituted into the rules (no raw placeholder)', () => {
  const prompt = buildPrompt('q', FAKE_KB, CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(!prompt.includes('${OUT_OF_SCOPE}'), 'placeholder was not substituted');
  assert.ok(prompt.includes(CV_OUT_OF_SCOPE_MESSAGE));
});

test('buildPrompt: contains the Sources / question / answer scaffolding', () => {
  const prompt = buildPrompt('What is his tech stack?', FAKE_KB, CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(prompt.includes('Sources:'));
  assert.ok(prompt.includes('User question:'));
  assert.ok(prompt.includes('Your answer:'));
  assert.ok(prompt.includes('What is his tech stack?'));
});

test('buildPrompt: custom out-of-scope message is honoured', () => {
  const custom = 'OUT OF SCOPE MARKER';
  const prompt = buildPrompt('q', FAKE_KB, custom);
  assert.ok(prompt.includes(custom));
  assert.ok(!prompt.includes('${OUT_OF_SCOPE}'));
});

test('buildPrompt: renders each source with its index, title, section, and url', () => {
  const prompt = buildPrompt('q', FAKE_KB, CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(/Source 1:.*Flagship AI Project.*\(project\)/s.test(prompt));
  assert.ok(/Source 2:.*Profile.*\(profile\)/s.test(prompt));
  assert.ok(prompt.includes('URL: /projects'));
  assert.ok(prompt.includes('URL: /'));
});

// ─── priority ordering ─────────────────────────────────────────
test('buildPrompt: sorts sources by priority descending (flagship first)', () => {
  const prompt = buildPrompt('q', FAKE_KB, CV_OUT_OF_SCOPE_MESSAGE);
  const flagshipIdx = prompt.indexOf('Flagship AI Project');
  const profileIdx = prompt.indexOf('Profile');
  assert.ok(flagshipIdx > -1 && profileIdx > -1);
  assert.ok(
    flagshipIdx < profileIdx,
    'priority-5 entry should appear before priority-1 entry',
  );
});

test('buildPrompt: ties in priority break by title alphabetically', () => {
  const kb = [
    { title: 'Zeta', section: 'project', content: 'z', priority: 3 },
    { title: 'Alpha', section: 'project', content: 'a', priority: 3 },
  ];
  const prompt = buildPrompt('q', kb, CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(prompt.indexOf('Alpha') < prompt.indexOf('Zeta'));
});

test('buildPrompt: entries without priority are treated as 0 and sort last', () => {
  const kb = [
    { title: 'NoPrio', section: 'project', content: 'n' },
    { title: 'HighPrio', section: 'project', content: 'h', priority: 2 },
  ];
  const prompt = buildPrompt('q', kb, CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(prompt.indexOf('HighPrio') < prompt.indexOf('NoPrio'));
});

// ─── edge cases ────────────────────────────────────────────────
test('buildPrompt: empty knowledge still produces valid structure', () => {
  const prompt = buildPrompt('q', [], CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(prompt.startsWith(ANTI_INJECTION_CLAUSE));
  assert.ok(prompt.includes('Sources:'));
  assert.ok(prompt.includes('User question:'));
});

test('buildPrompt: falls back to default out-of-scope message when omitted', () => {
  const prompt = buildPrompt('q', FAKE_KB);
  assert.ok(!prompt.includes('${OUT_OF_SCOPE}'));
});

// ─── integration with the real retriever (mirrors chat.ts flow) ─
test('integration: retrieve + buildPrompt keeps the anti-injection clause for real queries', () => {
  const knowledge = findRelevantCvKnowledge(
    'What is Vimal\u2019s payroll experience?',
    CV_KNOWLEDGE,
  );
  const prompt = buildPrompt('What is Vimal\u2019s payroll experience?', knowledge, CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(prompt.startsWith(ANTI_INJECTION_CLAUSE));
  assert.ok(prompt.includes(CV_OUT_OF_SCOPE_MESSAGE));
  assert.ok(/Source 1:/s.test(prompt));
});

test('integration: out-of-scope query yields no sources but prompt still well-formed', () => {
  const knowledge = findRelevantCvKnowledge('Tell me a joke', CV_KNOWLEDGE);
  assert.equal(knowledge.length, 0);
  const prompt = buildPrompt('Tell me a joke', knowledge, CV_OUT_OF_SCOPE_MESSAGE);
  assert.ok(prompt.startsWith(ANTI_INJECTION_CLAUSE));
  assert.ok(!/Source 1:/s.test(prompt));
});
