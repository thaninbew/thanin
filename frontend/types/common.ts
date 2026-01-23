export interface ListItem {
  id: string;
  imageUrl?: string;
  name: string;
  role: string;
  dateRange: string;
}

export interface SectionProps {
  title: string;
  description: string;
  items: ListItem[];
} 