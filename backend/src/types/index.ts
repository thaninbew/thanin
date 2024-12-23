export interface User {
    id: number;
    username: string;
    password: string;
  }
  
  export interface Project {
    id: number;
    name: string;
    positions: string;
    description: string;
    githubLink?: string;
    liveLink?: string;
    technologies: string;
    skills: string;
    starredSkills?: string;
    images?: string;
  }
  
  export interface Experience {
    id: number;
    companyName: string;
    positions: string;
    location?: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    technologies?: string;
    skills?: string;
  }
  