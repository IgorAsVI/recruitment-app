export interface Vacancy {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  area: string;
  postedDate: Date;
  requirements: string[];
  benefits: string[];
  salary?: string;
  company: string;
  isActive: boolean;
} 