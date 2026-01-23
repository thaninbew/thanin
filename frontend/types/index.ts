export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  companyName: string;
  role: string;
  description: string;
  longDescription?: string;
  startDate: Date;
  endDate?: Date;
  technologies: string[];
  imageUrl?: string;
  location: string;
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DetailPageProps {
  data: Project | Experience;
  type: 'project' | 'experience';
} 