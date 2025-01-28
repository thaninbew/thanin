import ProjectDetail from '../../../components/ProjectDetail';

interface LearningOutcome {
  id?: string;
  header: string;
  description: string;
  position: number;
  projectId?: string;
  experienceId?: string;
}

interface Project {
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

async function getProject(id: string) {
  const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch project');
  }
 
  return res.json();
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project: Project = await getProject(params.id);
  return <ProjectDetail project={project} />;
} 