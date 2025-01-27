interface LearningOutcome {
  id?: string;
  header: string;
  description: string;
  position: number;
  projectId?: string;
  experienceId?: string;
}

interface BaseEntity {
  id: string;
  name: string;
  role?: string;
  description: string;
  shortDesc: string;
  imageUrl?: string;
  gifUrl?: string;
  extraImages?: string[];
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  learningOutcomes: LearningOutcome[];
  dateRange: string;
  position: number;
  published: boolean;
  updatedAt: string;
}

interface Project extends BaseEntity {
  // Project-specific fields if needed
}

interface Experience extends BaseEntity {
  role: string; // Required for Experience
}

export type { LearningOutcome, BaseEntity, Project, Experience };
  