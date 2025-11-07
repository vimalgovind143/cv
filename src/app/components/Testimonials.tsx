'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Testimonial {
  author: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  id?: string;
}

const defaultAvatar = '/placeholder-avatar.png';

const TestimonialCard = memo(({ testimonial }: { testimonial: Testimonial }) => (
  <motion.div
    className="flex flex-col rounded-xl bg-zinc-50 p-6 dark:bg-zinc-800/50"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="relative">
      <svg
        className="absolute -left-3 -top-3 h-8 w-8 text-zinc-300 dark:text-zinc-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
      </svg>
      <blockquote className="relative">
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          {testimonial.content}
        </p>
      </blockquote>
    </div>
    <div className="mt-6 flex items-center">
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
        <Image
          src={testimonial.avatar || defaultAvatar}
          alt={`${testimonial.author}'s avatar`}
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="ml-4">
        <div className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          {testimonial.author}
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {testimonial.role} at {testimonial.company}
        </div>
      </div>
    </div>
  </motion.div>
));

TestimonialCard.displayName = 'TestimonialCard';

export function Testimonials({ testimonials, id }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextTestimonials = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevTestimonials = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <motion.section
      id={id}
      className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-700/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <span className="ml-3">Testimonials</span>
      </h2>

      <div className="relative mt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="wait">
            {currentTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.author} testimonial={testimonial} />
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonials}
              className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              disabled={currentIndex === 0}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonials}
              className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              disabled={currentIndex === totalPages - 1}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
