import { PersonalInfo, Education, Experience, ContactInfo } from "@/types";

export const personalInfo: PersonalInfo = {
  name: "GONA",
  fullName: "Glen Orphée NZIENGUI-AKOUMBOU",
  title: "Développeur de solutions numériques",
  description:
    "Grâce à des compétences acquises en développement web et en graphic design, j'ambitionne mettre mes compétences à la réalisation de vos projets.",
  email: "contact@gona241.com",
  phone: ["+241 77187894", "+241 62102805"],
  location: "Nkok Ntoum",
  birthDate: "23 janvier 1996",
  nationality: "Gabonaise",
  profileImage: "/images/profile/glen-orphee.png",
};

export const education: Education[] = [
  {
    title: "Certification en Développement Web & Web Mobile",
    institution: "Ecole 241",
    period: "Février 2022 - septembre 2022",
  },
];

export const experiences: Experience[] = [
  {
    role: "Développeur de solutions numériques",
    company: "Terainterface",
  },
  {
    role: "Développeur Web & Web Mobile",
    company: "Ecole 241 Business",
    period: "juin 2022 - septembre 2022",
  },
];

export const contactInfo: ContactInfo = {
  address: "Nkok Ntoum, Gabon",
  email: "contact@gona241.com",
  phone: ["+241 77187894", "+241 62102805"],
  whatsapp: "+241 77187894",
};
