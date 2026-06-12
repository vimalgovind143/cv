import {
  CV_AI_QUOTA_MESSAGE,
  CV_ASSISTANT_EMAIL,
  CV_OUT_OF_SCOPE_MESSAGE,
  findRelevantCvKnowledge,
} from '../../src/lib/cv-knowledge';

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

function buildPrompt(question: string) {
  const context = findRelevantCvKnowledge(question)
    .map(
      (entry, index) =>
        `Source ${index + 1}: ${entry.title} (${entry.section})\n${entry.content}\nURL: ${
          entry.url ?? '/'
        }`,
    )
    .join('\n\n');

  return `You are Ask Vimal, a concise assistant on Vimal Govind Markkasseri's CV website.
Answer only using the CV context below.
If the question is outside the CV context, reply exactly: "${CV_OUT_OF_SCOPE_MESSAGE}"
If the answer is not explicitly in the context, reply exactly: "${CV_OUT_OF_SCOPE_MESSAGE}"
Keep answers short, factual, and useful for recruiters or technical visitors.
Do not invent private details, salary, availability, or claims not present in the context.
Do not answer general knowledge, coding, politics, health, finance, jokes, news, or unrelated personal questions.
Return only the final user-facing answer.

CV context:
${context}

Question:
${question}

Answer:`;
}

function cleanAnswer(answer: string) {
  const cleaned = answer
    .replace(/^[\s\S]*assistantfinal/i, '')
    .replace(/^[\s\S]*final\s*/i, '')
    .replace(/^assistant\s*/i, '')
    .trim();

  if (/^(we need to answer|we have to answer|according to the cv context)/i.test(cleaned)) {
    const lines = cleaned
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.at(-1) ?? cleaned;
  }

  return cleaned;
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

  const relevantKnowledge = findRelevantCvKnowledge(message);

  if (relevantKnowledge.length === 0) {
    return jsonResponse({ answer: CV_OUT_OF_SCOPE_MESSAGE, fallback: true });
  }

  try {
    const result = await context.env.AI.run(MODEL, {
      prompt: buildPrompt(message),
      max_tokens: 320,
      temperature: 0.2,
    });
    const answer = cleanAnswer(extractAnswer(result));

    return jsonResponse({
      answer:
        answer ||
        `I do not have enough information in Vimal's CV to answer that. You can contact him at ${CV_ASSISTANT_EMAIL}.`,
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
  return jsonResponse({ status: 'Ask Vimal is ready.' });
}
