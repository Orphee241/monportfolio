import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "static-web",
    title: "Création d'interfaces web statiques",
    description: "Avec les langages HTML, CSS, et JavaScript",
    icon: "BiLaptop",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "dynamic-web",
    title: "Création d'interfaces web dynamiques",
    description: "Avec Next.js",
    icon: "BiLaptop",
    technologies: ["Next.js", "React", "TypeScript"],
  },
  {
    id: "devops",
    title: "Devops",
    description: "Avec Coolify",
    icon: "BiMusic",
    technologies: ["Coolify", "Docker", "CI/CD"],
  },
  {
    id: "graphic-design",
    title: "Création de visuels",
    description: "Avec Photoshop",
    icon: "BiLaptop",
    technologies: ["Adobe Photoshop", "Design Graphique"],
  },
];
