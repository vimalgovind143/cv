'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

/** HTML tag names that have a corresponding `motion.<tag>` component. */
type MotionTagName =
  | 'div'
  | 'section'
  | 'aside'
  | 'article'
  | 'ul'
  | 'li'
  | 'h1'
  | 'h2'
  | 'p'
  | 'span';

type RevealProps = {
  children: ReactNode;
  /** Animation delay in seconds (use index * step for staggered lists). */
  delay?: number;
  /** Initial vertical offset in px before the element settles into place. */
  y?: number;
  /** Animate on mount (above-the-fold) instead of when scrolled into view. */
  immediate?: boolean;
  /** Underlying element to render. Defaults to a div. */
  as?: MotionTagName;
  className?: string;
};

// Matches the easing curve already used by `.pointer-tech-spark` in globals.css.
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Lightweight scroll/mount reveal wrapper. Lets server-rendered pages opt into
 * a gentle fade-up without becoming client components themselves — only this
 * wrapper hydrates. Respects `prefers-reduced-motion`: when reduce is set the
 * children render statically with no offset or transition.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  immediate = false,
  as = 'div',
  className,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const StaticTag = as as ElementType;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const MotionTag = motion[as] as ElementType;
  const target = { opacity: 1, y: 0 };

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate
        ? { animate: target }
        : { whileInView: target, viewport: { once: true, margin: '-80px' } })}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
