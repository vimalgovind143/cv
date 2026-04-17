interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div
      className="prose prose-invert max-w-none font-body"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
