import {
  CV_AI_QUOTA_MESSAGE,
  CV_ASSISTANT_EMAIL,
  CV_OUT_OF_SCOPE_MESSAGE,
  CV_SENSITIVE_QUESTION_MESSAGE,
  CV_KNOWLEDGE_VERSION,
  classifyCvQuestion,
  findRelevantCvKnowledge,
  isGroundedIn,
} from '../../src/lib/cv-knowledge';
import { buildPrompt } from '../../src/lib/cv-prompt.mjs';

type AiBinding = {
  run: (
    model: string,
    input: {
      prompt: string;
      max_tokens?: number;
      temperature?: number;
    },
  ) => Promise<unknown>;
};

type Env = {
  AI: AiBinding;
};

type PagesContext = {
  request: Request;
  env: Env;
};

type ChatRequest = {
  message?: unknown;
};

const MODEL = '@cf/meta/llama-3.2-1b-instruct';
const MAX_MESSAGE_LENGTH = 400;
const MAX_ANSWER_LENGTH = 600;

function jsonResponse(body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    headers: {
      'cache-control': 'no-store',
      ...init?.headers,
    },
    status: init?.status,
    statusText: init?.statusText,
  });
}

function extractAnswer(result: unknown): string {
  if (typeof result === 'string') {
    return result;
  }

  if (!result) {
    return '';
  }

  if (Array.isArray(result)) {
    return result.map(extractAnswer).filter(Boolean).join('\n');
  }

  if (typeof result !== 'object') {
    return '';
  }

  const candidate = result as {
    response?: unknown;
    result?: unknown;
    answer?: unknown;
    text?: unknown;
    output_text?: unknown;
    output?: unknown;
    content?: unknown;
    choices?: unknown;
    message?: unknown;
  };

  for (const value of [
    candidate.response,
    candidate.result,
    candidate.answer,
    candidate.text,
    candidate.output_text,
    candidate.output,
    candidate.content,
    candidate.choices,
    candidate.message,
  ]) {
    if (typeof value === 'string') {
      return value;
    }

    const nestedAnswer: string = extractAnswer(value);

    if (nestedAnswer) {
      return nestedAnswer;
    }
  }

  return '';
}

function isQuotaError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return /quota|limit|rate|exceed|exhaust|neuron|429|403/i.test(message);
}

// Exported for the test suite so it can assert the anti-injection clause
// and scope rules are present.
export function buildPromptForTest(question: string) {
  const knowledge = findRelevantCvKnowledge(question);
  return buildPrompt(question, knowledge, CV_OUT_OF_SCOPE_MESSAGE);
}

function cleanAnswer(answer: string) {
  const cleaned = answer
    .replace(/^[\s\S]*assistantfinal/i, '')
    .replace(/^[\s\S]*final\s*/i, '')
    .replace(/^assistant\s*/i, '')
    .trim();

  if (/^(we need to answer|we have to answer|according to the (cv )?context)/i.test(cleaned)) {
    const lines = cleaned
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.at(-1) ?? cleaned;
  }

  return cleaned;
}

// Strip Markdown artifacts that the small LLM sometimes emits. Plain
// prose renders cleanly in the chat panel; bullets/headings/code blocks
// would otherwise leak formatting characters into the conversation.
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/(?<!_)_([^_\n]+)_(?!_)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateAnswer(answer: string): string {
  if (answer.length <= MAX_ANSWER_LENGTH) return answer;
  const trimmed = answer.slice(0, MAX_ANSWER_LENGTH);
  const lastSpace = trimmed.lastIndexOf(' ');
  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : MAX_ANSWER_LENGTH)}…`;
}

export async function onRequestPost(context: PagesContext) {
  if (!context.env.AI) {
    return jsonResponse(
      {
        answer: CV_AI_QUOTA_MESSAGE,
        fallback: true,
      },
      { status: 503 },
    );
  }

  let payload: ChatRequest;

  try {
    payload = (await context.request.json()) as ChatRequest;
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!message) {
    return jsonResponse({ error: 'Message is required.' }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      { error: `Please keep the question under ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 },
    );
  }

  // Classify first — sensitive and out-of-scope questions get their own
  // dedicated fallback messages instead of the generic OUT_OF_SCOPE one.
  const classification = classifyCvQuestion(message);

  if (classification === 'out-of-scope') {
    return jsonResponse({ answer: CV_OUT_OF_SCOPE_MESSAGE, fallback: true });
  }

  if (classification === 'sensitive') {
    return jsonResponse({
      answer: CV_SENSITIVE_QUESTION_MESSAGE,
      fallback: true,
    });
  }

  const relevantKnowledge = findRelevantCvKnowledge(message);

  if (relevantKnowledge.length === 0) {
    return jsonResponse({ answer: CV_OUT_OF_SCOPE_MESSAGE, fallback: true });
  }

  try {
    const result = await context.env.AI.run(MODEL, {
      prompt: buildPrompt(message, relevantKnowledge),
      max_tokens: 320,
      temperature: 0.2,
    });
    const answer = stripMarkdown(
      cleanAnswer(extractAnswer(result)),
    );
    const finalAnswer = truncateAnswer(answer);

    // Defense-in-depth: if the model's answer is not plausibly grounded
    // in the retrieved Sources, replace with the out-of-scope message so
    // the user never sees hallucinated content.
    if (!isGroundedIn(finalAnswer, relevantKnowledge)) {
      return jsonResponse({
        answer: CV_OUT_OF_SCOPE_MESSAGE,
        fallback: true,
        knowledgeVersion: CV_KNOWLEDGE_VERSION,
      });
    }

    return jsonResponse({
      answer:
        finalAnswer ||
        `I do not have enough information in Vimal's CV to answer that. You can contact him at ${CV_ASSISTANT_EMAIL}.`,
      fallback: !finalAnswer,
      knowledgeVersion: CV_KNOWLEDGE_VERSION,
    });
  } catch (error) {
    if (isQuotaError(error)) {
      return jsonResponse(
        {
          answer: CV_AI_QUOTA_MESSAGE,
          fallback: true,
        },
        { status: 429 },
      );
    }

    return jsonResponse(
      {
        answer: `I could not reach the CV assistant right now. Please contact me by email: ${CV_ASSISTANT_EMAIL}`,
        fallback: true,
      },
      { status: 503 },
    );
  }
}

export function onRequestGet() {
  return jsonResponse({ status: 'Ask Vimal is ready.', version: CV_KNOWLEDGE_VERSION });
}
