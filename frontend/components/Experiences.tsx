import React from 'react';
import ListSection from './ListSection';
import { ListItem } from '../types/common';

// Example data - this would come from an API in the real implementation
const sampleExperiences: ListItem[] = [
  {
    id: '1',
    name: 'Cursor',
    role: 'Software Engineer Intern',
    dateRange: '05/2023 - 08/2023'
  },
  {
    id: '2',
    name: 'Anthropic',
    role: 'Machine Learning Engineer',
    dateRange: '01/2023 - 04/2023'
  },
  {
    id: '3',
    name: 'Google',
    role: 'Software Engineer',
    dateRange: '06/2022 - Present'
  }
];

const Experiences: React.FC = () => {
  return (
    <ListSection
      title="Experiences"
      description="A collection of my professional journey and achievements in software engineering and AI"
      items={sampleExperiences}
    />
  );
};

export default Experiences; 