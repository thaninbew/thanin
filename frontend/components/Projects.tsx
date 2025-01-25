import React from 'react';
import ListSection from './ListSection';
import { ListItem } from '../types/common';

// Example data - this would come from an API in the real implementation
const sampleProjects: ListItem[] = [
  {
    id: '1',
    name: 'AI Music Generator',
    role: 'Full Stack Developer',
    dateRange: '2023'
  },
  {
    id: '2',
    name: 'Portfolio Website',
    role: 'Frontend Developer',
    dateRange: '2023'
  },
  {
    id: '3',
    name: 'ML Research Paper',
    role: 'Lead Researcher',
    dateRange: '2022'
  }
];

const Projects: React.FC = () => {
  return (
    <ListSection
      title="Projects"
      description="A showcase of my personal and collaborative projects in software development and AI"
      items={sampleProjects}
    />
  );
};

export default Projects; 