// Pure, testable logic for the CV chat assistant's knowledge retrieval.
//
// This file is plain ESM JavaScript so it can be loaded directly by
// `node --test` without a TypeScript toolchain. The TS-side facade in
// `src/lib/cv-knowledge.ts` owns the type definitions and re-exports the
// public surface (`CV_KNOWLEDGE`, `findRelevantCvKnowledge`,
// `isClearlyOutsideCvScope`, `isGroundedIn`, etc.).
//
// Keep this file dependency-free: no npm packages, no FS, no network.

export const TOKEN_PATTERN = /[a-z0-9+#.]+/gi;

export const STOP_WORDS = new Set([
  'a', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'being',
  'by', 'can', 'could', 'did', 'do', 'does', 'doing', 'done', 'each',
  'every', 'few', 'for', 'from', 'had', 'has', 'have', 'having', 'he',
  'her', 'him', 'his', 'i', 'in', 'into', 'is', 'it', 'its', 'just',
  'less', 'many', 'me', 'more', 'most', 'much', 'my', 'no', 'not', 'of',
  'on', 'only', 'or', 'our', 'over', 'shall', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'them', 'then',
  'there', 'these', 'they', 'this', 'those', 'to', 'us', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'who', 'whom', 'why',
  'will', 'with', 'would', 'you', 'your',
]);

// Explicit forward + reverse synonym map. Each key expands to its list of
// equivalents. Use exact equality when matching so we never over-expand.
export const SYNONYMS = {
  dotnet: ['.net core', '.net', 'dotnet core'],
  '.net': ['dotnet core', 'dotnet', '.net core'],
  '.net core': ['dotnet', '.net', 'dotnet core'],
  'dotnet core': ['.net', '.net core', 'dotnet'],
  sk: ['semantic kernel'],
  'semantic kernel': ['sk'],
  aoai: ['azure openai'],
  'azure openai': ['aoai'],
  csharp: ['c#', 'c sharp'],
  'c#': ['csharp', 'c sharp'],
  'c sharp': ['c#', 'csharp'],
  mssql: ['sql server', 'sqlserver'],
  sqlserver: ['sql server', 'mssql'],
  'sql server': ['mssql', 'sqlserver'],
  reactjs: ['react', 'react.js'],
  'react.js': ['react', 'reactjs'],
  react: ['reactjs', 'react.js'],
  angularjs: ['angular', 'angular.js'],
  'angular.js': ['angular', 'angularjs'],
  angular: ['angularjs', 'angular.js'],
  efcore: ['entity framework core', 'ef core'],
  'ef core': ['entity framework core', 'efcore'],
  'entity framework core': ['ef core', 'efcore'],
  'entity framework': ['entity framework core', 'ef core', 'efcore'],
  nextjs: ['next.js'],
  'next.js': ['nextjs'],
  js: ['javascript'],
  javascript: ['js'],
  ts: ['typescript'],
  typescript: ['ts'],
  k8s: ['kubernetes'],
  kubernetes: ['k8s'],
  postgres: ['postgresql'],
  postgresql: ['postgres'],
  mongo: ['mongodb'],
  mongodb: ['mongo'],
  wfh: ['remote work', 'work from home'],
  'work from home': ['remote work', 'wfh'],
  'remote work': ['work from home', 'wfh'],
};

// Off-topic topics that the assistant cannot help with. Any match
// short-circuits retrieval and the API returns CV_OUT_OF_SCOPE_MESSAGE.
export const OUT_OF_SCOPE_PATTERNS = [
  // Generic off-topic categories
  /\b(capital|weather|news|stock|crypto|recipe|movie|sports|translate|homework|joke|fun fact)\b/i,
  // Coding / build requests
  /\b(write|generate|create|build|debug|fix|implement|refactor)\b.*\b(code|component|app|script|function|class|sql|api|program)\b/i,
  // Tutorial-style questions
  /\b(how do i|how to|teach me|step by step|tutorial|step-by-step)\b/i,
  // Opinions, politics, advice
  /\b(politics|political|vote|election|opinion|advice|recommend me|should i)\b/i,
];

// Questions about sensitive topics that the CV legitimately doesn't cover.
// Any match short-circuits retrieval and the API returns the friendlier
// CV_SENSITIVE_QUESTION_MESSAGE ("please email me"). We deliberately do
// NOT block the standalone word 'remote' because the FAQ entry answers
// "are you open to remote work?" — only relocation/visa/etc. are blocked.
export const SENSITIVE_PATTERNS = [
  // Compensation + timing
  /\b(salary|wage|compensation|pay ?check|paycheck|ctc|rate|hourly rate|billing rate|package|benefits|equity|stock options|bonus|notice period)\b/i,
  // Relocation / authorization to work
  /\b(relocate|relocation|visa|sponsor|sponsorship|right to work|work permit|work authorization|green card|pr|citizen|citizenship)\b/i,
  // Hiring process
  /\b(interview process|interview questions?|hiring process|hire|contract|offer letter|joining date|expected date)\b/i,
  // Personal attributes (incl. "how old")
  /\b(age|how old|years old|family|religion|nationality|gender|marital|marry|health|illness|disability|ethnicity|race)\b/i,
];

export function isClearlyOutsideCvScope(question) {
  if (!question) return false;
  return OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(question));
}

export function isSensitiveCvQuestion(question) {
  if (!question) return false;
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(question));
}

// Combined classifier for chat handler use.
// Returns: 'in-scope' | 'sensitive' | 'out-of-scope'
export function classifyQuestion(question) {
  if (isClearlyOutsideCvScope(question)) return 'out-of-scope';
  if (isSensitiveCvQuestion(question)) return 'sensitive';
  return 'in-scope';
}

// Lightweight English suffix stripper. No NLP library — apply one rule at a
// time so we don't over-stem short tokens.
const SUFFIX_RULES = [
  [/ization$/i, 'ize'],
  [/izing$/i, 'ize'],
  [/ized$/i, 'ize'],
  [/isation$/i, 'ise'],
  [/ising$/i, 'ise'],
  [/ised$/i, 'ise'],
  [/ation$/i, 'ate'],
  [/tion$/i, 't'],
  [/ments$/i, 'ment'],
  [/ies$/i, 'y'],
  [/ied$/i, 'y'],
  [/ing$/i, ''],
  [/ed$/i, ''],
  [/s$/i, ''],
];

export function stem(word) {
  let s = word;
  if (s.length <= 4) return s;
  for (const [pattern, replacement] of SUFFIX_RULES) {
    if (pattern.test(s)) {
      const next = s.replace(pattern, replacement);
      if (next.length >= 3) {
        s = next;
      }
      break;
    }
  }
  return s;
}

export function tokenize(value) {
  if (!value) return [];
  return (value.toLowerCase().match(TOKEN_PATTERN) ?? []).filter(
    (token) => token.length > 1 && !STOP_WORDS.has(token),
  );
}

// Expand a token list with synonyms. Exact-match only so we never expand a
// token that's merely a substring of something else.
export function expandWithSynonyms(tokens) {
  const out = new Set(tokens);
  for (const token of tokens) {
    const syns = SYNONYMS[token];
    if (syns) {
      for (const s of syns) out.add(s);
    }
  }
  return Array.from(out);
}

export function bigramsOf(text) {
  const tokens = tokenize(text);
  const out = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    out.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return out;
}

// Score one KB entry against the (already-normalized) query tokens +
// bigrams. Higher score = more relevant. Priority/tags add a small boost.
export function scoreEntry(entry, queryTokens, queryBigrams) {
  const text = `${entry.title ?? ''} ${entry.section ?? ''} ${entry.content ?? ''}`
    .toLowerCase();
  const entryBigrams = new Set(bigramsOf(text));
  const entryStemTokens = new Set(
    tokenize(text).map(stem).filter((t) => t && t.length > 1),
  );

  let score = 0;

  // Token overlap with stemming
  for (const qt of queryTokens) {
    const qs = stem(qt);
    if (entryStemTokens.has(qt) || entryStemTokens.has(qs)) {
      score += 1;
    } else if (text.includes(qt)) {
      score += 0.5;
    }
  }

  // Multi-word phrase match — strong signal
  for (const qb of queryBigrams) {
    if (entryBigrams.has(qb) || text.includes(qb)) {
      score += 2;
    }
  }

  // Tag boost — only count when a tag token matches the query (not when
  // it merely appears in the entry's text, which is trivially true and
  // would otherwise dominate the ranking).
  if (Array.isArray(entry.tags) && entry.tags.length > 0) {
    const queryTokenSet = new Set(queryTokens);
    const queryTokenStems = new Set(queryTokens.map(stem));
    for (const tag of entry.tags) {
      for (const tt of tokenize(tag)) {
        const tts = stem(tt);
        if (queryTokenSet.has(tt) || queryTokenStems.has(tts)) {
          score += 0.5;
        }
      }
    }
  }

  // Priority boost — small additive nudge (1-5 scale)
  if (typeof entry.priority === 'number' && entry.priority > 0) {
    score += entry.priority * 0.2;
  }

  return score;
}

// Retrieve the top `limit` KB entries relevant to `question`. Requires the
// caller to pass the KB array so the pure file stays decoupled from the
// module-level CV_KNOWLEDGE constant.
export function findRelevantCvKnowledge(question, knowledge, limit = 5) {
  // Short-circuit on BOTH out-of-scope and sensitive topics so the chat
  // handler can pick the right fallback message without re-running the
  // classifier.
  if (classifyQuestion(question) !== 'in-scope') {
    return [];
  }

  const baseTokens = tokenize(question);
  if (baseTokens.length === 0) {
    return [];
  }

  // Expand with synonyms before scoring so e.g. "dotnet" still hits
  // entries that only contain ".net".
  const queryTokens = expandWithSynonyms(baseTokens.map(stem));
  const queryBigrams = bigramsOf(question);

  const scored = (knowledge ?? [])
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, queryTokens, queryBigrams),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);

  return scored;
}

// Post-generation grounding check. Returns true if the answer is plausibly
// drawn from the retrieved sources.
//
// Two checks, both must pass:
//   1. Token overlap ratio (after stemming) >= overlapThreshold (default 0.55)
//   2. Answer length <= sources.length * lengthMultiplier (default 1.5)
//
// Short answers (< minAnswerTokens tokens) bypass both checks — a "Yes" or
// "He is based in Bahrain" answer shouldn't be rejected for length.
export function isGroundedIn(answer, sources, opts = {}) {
  const {
    overlapThreshold = 0.55,
    lengthMultiplier = 1.5,
    minAnswerTokens = 4,
  } = opts;

  const cleaned = (answer ?? '').trim();

  if (!cleaned) return false;
  if (!Array.isArray(sources) || sources.length === 0) return false;

  const answerTokens = tokenize(cleaned);
  if (answerTokens.length < minAnswerTokens) return true;

  const sourceText = sources
    .map((s) => `${s.title ?? ''} ${s.content ?? ''}`)
    .join(' ')
    .toLowerCase();

  if (!sourceText.trim()) return false;

  const stemSet = new Set(
    tokenize(sourceText).map(stem).filter((t) => t && t.length > 1),
  );

  const overlap = answerTokens.filter((t) => stemSet.has(stem(t))).length;
  const overlapRatio = overlap / answerTokens.length;

  if (overlapRatio < overlapThreshold) return false;

  const sourcesLen = sources.reduce(
    (sum, s) => sum + ((s.content ?? '').length),
    0,
  );
  if (cleaned.length > sourcesLen * lengthMultiplier) return false;

  return true;
}
