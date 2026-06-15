// Test suite for the pure CV knowledge retriever.
//
// Runs under bare `node --test` — no TS toolchain, no npm deps. The module
// under test (cv-knowledge-pure.mjs) is intentionally dependency-free so it
// can be imported directly here.
//
//   node --test src/lib/cv-knowledge.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  tokenize,
  stem,
  expandWithSynonyms,
  bigramsOf,
  scoreEntry,
  classifyQuestion,
  isClearlyOutsideCvScope,
  isSensitiveCvQuestion,
  findRelevantCvKnowledge,
  isGroundedIn,
  SYNONYMS,
  STOP_WORDS,
} from './cv-knowledge-pure.mjs';
import { CV_KNOWLEDGE } from './cv-knowledge-data.mjs';

// ─── tokenize ───────────────────────────────────────────────────
test('tokenize: lowercases, splits on non-word, drops stop words & 1-char tokens', () => {
  const tokens = tokenize('What is the .NET Core stack?');
  assert.ok(!tokens.includes('what'));
  assert.ok(!tokens.includes('is'));
  assert.ok(!tokens.includes('the'));
  assert.ok(tokens.includes('.net'));
  assert.ok(tokens.includes('core'));
  assert.ok(tokens.includes('stack'));
});

test('tokenize: keeps meaningful punctuation inside tech tokens (#, +, .)', () => {
  const tokens = tokenize('C# and C++ and node.js');
  assert.ok(tokens.includes('c#'));
  assert.ok(tokens.includes('c++'));
  assert.ok(tokens.includes('node.js'));
});

test('tokenize: empty / nullish input returns []', () => {
  assert.deepEqual(tokenize(''), []);
  assert.deepEqual(tokenize(undefined), []);
  assert.deepEqual(tokenize(null), []);
});

test('tokenize: strips pure stop-word input to []', () => {
  assert.deepEqual(tokenize('the a an of to'), []);
});

// ─── stem ───────────────────────────────────────────────────────
test('stem: leaves short tokens (<=4 chars) untouched', () => {
  assert.equal(stem('sql'), 'sql');
  assert.equal(stem('net'), 'net');
  assert.equal(stem('api'), 'api');
});

test('stem: strips common suffixes without over-truncating', () => {
  assert.equal(stem('developing'), 'develop');
  assert.equal(stem('developed'), 'develop');
  assert.equal(stem('systems'), 'system');
  assert.equal(stem('modernization'), 'modernize');
});

test('stem: never returns a string shorter than 3 chars', () => {
  // "ies" -> would be too short via naive rule; stem guards this.
  for (const word of ['ties', 'dies', 'pies']) {
    assert.ok(stem(word).length >= 3, `${word} -> ${stem(word)}`);
  }
});

// ─── expandWithSynonyms ─────────────────────────────────────────
test('expandWithSynonyms: dotnet family expands mutually', () => {
  const expanded = new Set(expandWithSynonyms(['dotnet']));
  assert.ok(expanded.has('.net'));
  assert.ok(expanded.has('.net core'));
  assert.ok(expanded.has('dotnet core'));
});

test('expandWithSynonyms: sk <-> semantic kernel', () => {
  assert.ok(new Set(expandWithSynonyms(['sk'])).has('semantic kernel'));
  assert.ok(new Set(expandWithSynonyms(['semantic kernel'])).has('sk'));
});

test('expandWithSynonyms: unknown tokens pass through unchanged', () => {
  assert.deepEqual(expandWithSynonyms(['bahrain', 'erp']), ['bahrain', 'erp']);
});

test('expandWithSynonyms: dedupes', () => {
  const out = expandWithSynonyms(['react', 'reactjs']);
  assert.equal(new Set(out).size, out.length);
});

// ─── bigramsOf ──────────────────────────────────────────────────
test('bigramsOf: returns adjacent token pairs', () => {
  const bg = bigramsOf('sql server performance');
  assert.ok(bg.includes('sql server'));
  assert.ok(bg.includes('server performance'));
});

test('bigramsOf: single token yields no bigrams', () => {
  assert.deepEqual(bigramsOf('sql'), []);
});

// ─── classification ─────────────────────────────────────────────
test('isClearlyOutsideCvScope: true for off-topic categories', () => {
  assert.ok(isClearlyOutsideCvScope('What is the weather in Bahrain?'));
  assert.ok(isClearlyOutsideCvScope('Tell me a joke'));
  assert.ok(isClearlyOutsideCvScope('Write me a React component'));
  assert.ok(isClearlyOutsideCvScope('How do I deploy to Azure step by step?'));
});

test('isClearlyOutsideCvScope: false for genuine CV questions', () => {
  assert.ok(!isClearlyOutsideCvScope('What is Vimal\u2019s experience with payroll?'));
  assert.ok(!isClearlyOutsideCvScope('Tell me about the Semantic Kernel project'));
  assert.ok(!isClearlyOutsideCvScope('remote work'));
});

test('isSensitiveCvQuestion: true for salary/visa/interview', () => {
  assert.ok(isSensitiveCvQuestion('What is Vimal\u2019s salary expectation?'));
  assert.ok(isSensitiveCvQuestion('Does he need visa sponsorship?'));
  assert.ok(isSensitiveCvQuestion('How long is the interview process?'));
  assert.ok(isSensitiveCvQuestion('How old is he?'));
});

test('isSensitiveCvQuestion: does NOT block standalone "remote"', () => {
  // Deliberately allowed — FAQ answers the remote-work question.
  assert.ok(!isSensitiveCvQuestion('Is he open to remote work?'));
  assert.ok(!isSensitiveCvQuestion('remote roles'));
});

test('classifyQuestion: routes to the three buckets', () => {
  assert.equal(classifyQuestion('What is the capital of France?'), 'out-of-scope');
  assert.equal(classifyQuestion('What is his salary?'), 'sensitive');
  assert.equal(classifyQuestion('What tech stack does he use?'), 'in-scope');
});

test('classifyQuestion: empty/null is in-scope (no false block)', () => {
  assert.equal(classifyQuestion(''), 'in-scope');
  assert.equal(classifyQuestion(null), 'in-scope');
});

// ─── findRelevantCvKnowledge (integration with real KB) ────────
test('findRelevantCvKnowledge: returns [] for out-of-scope questions', () => {
  assert.deepEqual(findRelevantCvKnowledge('Tell me a joke', CV_KNOWLEDGE), []);
});

test('findRelevantCvKnowledge: returns [] for sensitive questions', () => {
  assert.deepEqual(findRelevantCvKnowledge('What is his salary?', CV_KNOWLEDGE), []);
});

test('findRelevantCvKnowledge: returns [] for tokenless queries', () => {
  assert.deepEqual(findRelevantCvKnowledge('the a an of', CV_KNOWLEDGE), []);
});

test('findRelevantCvKnowledge: payroll query surfaces payroll project', () => {
  const results = findRelevantCvKnowledge(
    'Tell me about the enterprise payroll system',
    CV_KNOWLEDGE,
  );
  assert.ok(results.length > 0);
  assert.ok(
    results.some((r) => /payroll/i.test(r.title)),
    'expected a payroll-titled entry',
  );
});

test('findRelevantCvKnowledge: Semantic Kernel query hits AI skills + flagship project', () => {
  const results = findRelevantCvKnowledge(
    'What is Vimal\u2019s Semantic Kernel experience?',
    CV_KNOWLEDGE,
  );
  assert.ok(results.length > 0);
  assert.ok(
    results.some((r) => /semantic kernel/i.test(r.title)),
    'expected a Semantic Kernel entry',
  );
});

test('findRelevantCvKnowledge: respects the limit argument', () => {
  const limited = findRelevantCvKnowledge(
    'ERP systems experience work history',
    CV_KNOWLEDGE,
    2,
  );
  assert.ok(limited.length <= 2);
});

test('findRelevantCvKnowledge: synonym expansion (dotnet -> .net)', () => {
  // Query uses "dotnet"; KB entries contain ".net core" / "asp.net".
  const results = findRelevantCvKnowledge('dotnet experience', CV_KNOWLEDGE);
  assert.ok(results.length > 0, 'synonym expansion should still retrieve entries');
});

test('findRelevantCvKnowledge: empty/null KB returns []', () => {
  assert.deepEqual(findRelevantCvKnowledge('payroll', []), []);
  assert.deepEqual(findRelevantCvKnowledge('payroll', null), []);
});

// ─── scoreEntry ─────────────────────────────────────────────────
test('scoreEntry: higher score for a matching entry than a non-matching one', () => {
  const payrollEntry = CV_KNOWLEDGE.find((e) => /payroll system/i.test(e.title));
  const blogEntry = CV_KNOWLEDGE.find((e) => /blog posts/i.test(e.title));
  const queryTokens = ['payroll', 'enterprise', 'system'];
  const queryBigrams = ['payroll system', 'enterprise system'];
  const payrollScore = scoreEntry(payrollEntry, queryTokens, queryBigrams);
  const blogScore = scoreEntry(blogEntry, queryTokens, queryBigrams);
  assert.ok(
    payrollScore > blogScore,
    `payroll (${payrollScore}) should outrank blog (${blogScore})`,
  );
});

// ─── isGroundedIn ───────────────────────────────────────────────
const SOURCES = [
  {
    title: 'Profile',
    content: 'Vimal is based in Manama Bahrain and has 16 years of ERP experience.',
  },
];

test('isGroundedIn: true for an answer drawn from source tokens', () => {
  assert.ok(isGroundedIn('Vimal is based in Manama Bahrain.', SOURCES));
});

test('isGroundedIn: false for a hallucinated answer with no token overlap', () => {
  assert.ok(!isGroundedIn('Vimal won an Olympic gold medal in gymnastics last summer.', SOURCES));
});

test('isGroundedIn: false for an answer far longer than its sources', () => {
  const longAnswer =
    'Vimal is based in Manama Bahrain and has sixteen years of ERP experience '.repeat(20);
  assert.ok(!isGroundedIn(longAnswer, SOURCES));
});

test('isGroundedIn: short answers bypass length/overlap checks', () => {
  assert.ok(isGroundedIn('Yes', SOURCES));
  assert.ok(isGroundedIn('He is in Bahrain', SOURCES));
});

test('isGroundedIn: empty answer or missing sources is false', () => {
  assert.ok(!isGroundedIn('', SOURCES));
  assert.ok(!isGroundedIn('Some answer', []));
  assert.ok(!isGroundedIn('Some answer', null));
});

// ─── KB integrity (cross-checks against the validator) ─────────
test('CV_KNOWLEDGE: every entry has required fields', () => {
  for (const entry of CV_KNOWLEDGE) {
    assert.ok(typeof entry.title === 'string' && entry.title.trim(), `missing title`);
    assert.ok(typeof entry.section === 'string' && entry.section.trim(), `bad section`);
    assert.ok(typeof entry.content === 'string' && entry.content.trim(), `missing content`);
  }
});

test('CV_KNOWLEDGE: titles are unique', () => {
  const titles = CV_KNOWLEDGE.map((e) => e.title);
  assert.equal(new Set(titles).size, titles.length, 'duplicate titles found');
});

test('CV_KNOWLEDGE: priority (when set) is between 1 and 5', () => {
  for (const entry of CV_KNOWLEDGE) {
    if (entry.priority !== undefined) {
      assert.ok(
        entry.priority >= 1 && entry.priority <= 5,
        `${entry.title} priority ${entry.priority} out of range`,
      );
    }
  }
});

test('SYNONYMS: STOP_WORDS never appears as a synonym key (would over-expand)', () => {
  for (const key of Object.keys(SYNONYMS)) {
    assert.ok(!STOP_WORDS.has(key), `synonym key "${key}" is also a stop word`);
  }
});
