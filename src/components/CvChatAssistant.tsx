'use client';

import { Bot, Loader2, Mail, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { CV_AI_QUOTA_MESSAGE, CV_ASSISTANT_EMAIL } from '@/lib/cv-knowledge';

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
};

const SUGGESTIONS = [
  'Summarize Vimal ERP experience',
  'Does he know Semantic Kernel?',
  'What AI projects has he worked on?',
  'Is he suitable for senior .NET?',
];

const INITIAL_MESSAGE =
  'Ask me about Vimal experience, ERP work, .NET background, AI projects, or Semantic Kernel.';

export default function CvChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'assistant', text: INITIAL_MESSAGE },
  ]);

  const sendMessage = async (message: string) => {
    const question = message.trim();

    if (!question || isLoading) {
      return;
    }

    setInput('');
    setIsOpen(true);
    setIsLoading(true);
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text: question }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });
      const payload = (await response.json()) as { answer?: string; error?: string };
      const answer =
        payload.answer ??
        payload.error ??
        `I could not answer that right now. Please contact me by email: ${CV_ASSISTANT_EMAIL}`;

      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: CV_AI_QUOTA_MESSAGE,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-30 print:hidden sm:right-6 sm:bottom-6">
      {isOpen ? (
        <section className="border-border bg-card text-card-foreground flex h-[min(34rem,calc(100vh-6rem))] w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-lg border shadow-2xl shadow-black/15">
          <header className="border-border flex items-center justify-between border-b px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">Ask Vimal</h2>
                <p className="text-muted-foreground truncate text-xs">CV assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground rounded-md p-2 transition-colors"
              aria-label="Close Ask Vimal"
              title="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading ? (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Thinking
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-border border-t p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  disabled={isLoading}
                  className="border-border bg-background text-muted-foreground hover:text-foreground rounded-full border px-2.5 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form
              className="flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
            >
              <label htmlFor="cv-chat-message" className="sr-only">
                Ask Vimal a question
              </label>
              <textarea
                id="cv-chat-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={1}
                maxLength={400}
                placeholder="Ask about experience..."
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-10 flex-1 resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Send message"
                title="Send"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <a
              href={`mailto:${CV_ASSISTANT_EMAIL}`}
              className="text-muted-foreground hover:text-foreground mt-2 flex items-center gap-1.5 text-xs transition-colors"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {CV_ASSISTANT_EMAIL}
            </a>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-xl shadow-black/20 transition-transform hover:-translate-y-0.5"
          aria-label="Open Ask Vimal CV assistant"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            <Sparkles
              className="absolute -top-2 -right-2 h-3.5 w-3.5 text-[#0b1118]"
              aria-hidden="true"
            />
          </span>
          Ask Vimal
        </button>
      )}
    </div>
  );
}
