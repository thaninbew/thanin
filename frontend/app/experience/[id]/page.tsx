import ExperienceDetail from '../../../components/ExperienceDetail';

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  shortDesc: string;
  imageUrl?: string;
  gifUrl?: string;
  technologies: string[];
  learningOutcomes: string[];
  dateRange: string;
  position: number;
  published: boolean;
}

async function getExperience(id: string) {
  const res = await fetch(`http://localhost:3001/api/experiences/${id}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch experience');
  }
 
  return res.json();
}

export default async function ExperiencePage({ params }: { params: { id: string } }) {
  const experience: Experience = await getExperience(params.id);
  return <ExperienceDetail experience={experience} />;
} 