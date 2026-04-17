import { ExternalLink, Star, GitFork, Code } from 'lucide-react';

interface GitHubRepoCardProps {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language?: string;
  url: string;
}

export function GitHubRepoCard({
  name,
  description,
  stars,
  forks,
  language,
  url,
}: GitHubRepoCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(0,215,255,0.1)]"
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-neon-blue">
          {name}
        </h3>
        <ExternalLink className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-neon-blue" />
      </div>
      
      <p className="mb-4 font-body text-sm text-muted-foreground">
        {description}
      </p>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {language && (
          <div className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>{language}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          <span>{stars}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <GitFork className="h-4 w-4" />
          <span>{forks}</span>
        </div>
      </div>
    </a>
  );
}
