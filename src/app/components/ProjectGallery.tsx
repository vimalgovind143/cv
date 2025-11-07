'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Project } from '@/types/resume';

interface ProjectGalleryProps {
  projects: Project[];
}

const ProjectCard = memo(({ project, onClick }: { project: Project; onClick: () => void }) => (
  <motion.div
    className="group relative cursor-pointer overflow-hidden rounded-lg"
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    layout
  >
    {project.image && (
      <Image
        src={project.image}
        alt={`${project.title} preview`}
        width={400}
        height={300}
        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
      <p className="text-sm text-zinc-200 line-clamp-2">{project.description}</p>
    </div>
  </motion.div>
));

ProjectCard.displayName = 'ProjectCard';

const ProjectModal = memo(({ project, onClose }: { project: Project; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white p-6 dark:bg-zinc-900"
      onClick={e => e.stopPropagation()}
    >
      {project.image && (
        <div className="relative h-[400px] w-full">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            className="rounded-lg object-cover"
            quality={90}
          />
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{project.title}</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => (
            <span
              key={index}
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
        {project.link && (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            View Project
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  </motion.div>
));

ProjectModal.displayName = 'ProjectModal';

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
