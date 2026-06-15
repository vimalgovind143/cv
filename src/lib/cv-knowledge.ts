import {
  isClearlyOutsideCvScope as isClearlyOutsideCvScopePure,
  isSensitiveCvQuestion as isSensitiveCvQuestionPure,
  classifyQuestion as classifyQuestionPure,
  findRelevantCvKnowledge as findRelevantCvKnowledgePure,
} from './cv-knowledge-pure.mjs';

// Re-export pure helpers so callers (chat handler, tests) can use them
// directly without reaching into the .mjs file.
export {
  TOKEN_PATTERN,
  STOP_WORDS,
  SYNONYMS,
  OUT_OF_SCOPE_PATTERNS,
  SENSITIVE_PATTERNS,
  stem,
  tokenize,
  expandWithSynonyms,
  bigramsOf,
  scoreEntry,
  isGroundedIn,
  isSensitiveCvQuestion,
  classifyQuestion,
} from './cv-knowledge-pure.mjs';

// Knowledge data lives in a sibling .mjs so it can be loaded directly by
// the check-knowledge script and node --test without a TS toolchain.
export { CV_KNOWLEDGE } from './cv-knowledge-data.mjs';
export { CV_KNOWLEDGE_VERSION } from './cv-knowledge-data.mjs';
import { CV_KNOWLEDGE as _CV_KNOWLEDGE } from './cv-knowledge-data.mjs';

// A CV knowledge entry. The core fields (title, section, content, url) are
// required; the rest are optional signals used by the retriever to improve
// ranking and by the API to render richer answers.
export type CvKnowledgeSection =
  | 'profile'
  | 'work'
  | 'project'
  | 'skills'
  | 'blog'
  | 'education'
  | 'achievements'
  | 'faq'
  | 'contact';

export type CvAudience = 'recruiter' | 'technical' | 'general';

export type CvKnowledgeEntry = {
  title: string;
  section: CvKnowledgeSection;
  content: string;
  url?: string;
  tags?: string[];
  priority?: number;
  facts?: string[];
  audience?: CvAudience[];
};

export const CV_ASSISTANT_EMAIL = 'hey@hellovg.win';

export const CV_AI_QUOTA_MESSAGE =
  'My 8-5 timing finished. The AI quota clocked out for today, so please contact me by email: hey@hellovg.win';

export const CV_OUT_OF_SCOPE_MESSAGE =
  "I can only answer from Vimal's CV, projects, skills, blog topics, and contact details. Ask me about his ERP work, .NET background, AI experience, Semantic Kernel, or email him at hey@hellovg.win.";

export const CV_SENSITIVE_QUESTION_MESSAGE =
  "I can't share that on the public site. For sensitive questions (salary, visa, interview logistics, etc.) please email me directly at hey@hellovg.win — I usually reply within a day.";

// Public wrappers that bind CV_KNOWLEDGE into the pure retriever so existing
// callers (functions/api/chat.ts) keep their old one-argument signature.
export function isClearlyOutsideCvScope(question: string): boolean {
  return isClearlyOutsideCvScopePure(question);
}

export function findRelevantCvKnowledge(
  question: string,
  limit = 5,
): CvKnowledgeEntry[] {
  return findRelevantCvKnowledgePure(
    question,
    _CV_KNOWLEDGE,
    limit,
  ) as CvKnowledgeEntry[];
}

export type CvQuestionClass = 'in-scope' | 'sensitive' | 'out-of-scope';

export function classifyCvQuestion(question: string): CvQuestionClass {
  return classifyQuestionPure(question) as CvQuestionClass;
}

// Back-compat: keep the boolean predicate available for callers that
// only care about sensitive vs not.
export function isSensitiveCvQuestionCheck(question: string): boolean {
  return isSensitiveCvQuestionPure(question);
}
