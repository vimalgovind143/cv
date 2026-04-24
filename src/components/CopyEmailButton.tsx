'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyEmailButtonProps {
  email: string;
}

export function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy ${email}`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-neon-green/60 hover:text-neon-green"
    >
      {copied ? <Check className="h-4 w-4 text-neon-green" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
