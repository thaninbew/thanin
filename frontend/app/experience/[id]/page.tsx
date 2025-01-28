import { Metadata } from 'next';
import ExperienceDetail from '../../../components/ExperienceDetail';

interface LearningOutcome {
  id: string;
  header: string;
  description: string;
  position: number;
}

interface Experience {
  id: string;
  name: string;
  role: string;
  description: string;
  shortDesc: string;
  imageUrl?: string;
  gifUrl?: string;
  technologies: string[];
  learningOutcomes: LearningOutcome[];
  dateRange: string;
  position: number;
  published: boolean;
}

async function getExperience(id: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${backendUrl}/api/experiences/${id}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch experience');
  }
 
  return res.json();
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const experience = await getExperience(params.id);
  
  return {
    title: `${experience.role} at ${experience.name}`,
    description: experience.shortDesc,
  };
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ExperiencePage({ params, searchParams }: Props) {
  const experience: Experience = await getExperience(params.id);
  return <ExperienceDetail experience={experience} />;
} 