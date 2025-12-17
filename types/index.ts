// Personal Information Types
export interface PersonalInfo {
  name: string;
  fullName: string;
  title: string;
  description: string;
  email: string;
  phone: string[];
  location: string;
  birthDate: string;
  nationality: string;
  profileImage: string;
}

// Education Type
export interface Education {
  title: string;
  institution: string;
  period: string;
}

// Experience Type
export interface Experience {
  role: string;
  company: string;
  period?: string;
}

// Skill Type
export interface Skill {
  id: string;
  name: string;
  level: number;
  category: "competence" | "tool";
}

// Service Type
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  technologies: string[];
}

// Portfolio Item Type
export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  category: "web" | "graphic";
  technologies?: string[];
}

// Contact Information Type
export interface ContactInfo {
  address: string;
  email: string;
  phone: string[];
  whatsapp: string;
}
