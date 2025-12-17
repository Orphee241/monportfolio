import { PortfolioItem } from "@/types";

// Web Development Projects
export const webProjects: PortfolioItem[] = [
  {
    id: "nmch-portfolio",
    title: "Portfolio NMCH",
    description: "Portfolio professionnel moderne développé avec Next.js et Tailwind CSS pour NMCH",
    image: "/images/portfolio/portfolionmcg.png",
    link: "https://nmch.vercel.app/",
    category: "web",
    technologies: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    id: "davys-portfolio",
    title: "Portfolio Davys",
    description: "Site portfolio élégant et responsive créé avec Next.js pour présenter les compétences de Davys",
    image: "/images/portfolio/portfoliodavys.png",
    link: "https://davysportfolio.vercel.app/",
    category: "web",
    technologies: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    id: "ecole241-business",
    title: "Ecole 241 Business",
    description: "Site web institutionnel pour Ecole 241 Business présentant les formations et services",
    image: "/images/portfolio/ecole241business.png",
    link: "https://business.ecole241.org/",
    category: "web",
    technologies: ["Next.js", "React"],
  },
  {
    id: "gona-portfolio",
    title: "Site officiel de GONA",
    description: "Portfolio personnel de GONA présentant ses compétences en développement web et design graphique",
    image: "/images/portfolio/gona.png",
    link: "https://gona241.com",
    category: "web",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
];

// Graphic Design Projects
export const graphicProjects: PortfolioItem[] = [
  {
    id: "img-2625",
    title: "Design graphique créatif",
    description: "Création graphique originale avec composition visuelle moderne",
    image: "/images/graphic-design/img-2625.png",
    category: "graphic",
  },
  {
    id: "eric-concert",
    title: "Affiche du concert d'Eric",
    description: "Affiche promotionnelle pour le concert d'Eric avec design musical dynamique",
    image: "/images/graphic-design/eric-concert.jpg",
    category: "graphic",
  },
  {
    id: "regis-atelier",
    title: "Atelier de formation par Régis MOUANDZA",
    description: "Affiche promotionnelle pour l'atelier de formation animé par Régis MOUANDZA",
    image: "/images/graphic-design/regis.jpg",
    category: "graphic",
  },
  {
    id: "formations-agcom",
    title: "Formations AGCOM",
    description: "Visuel promotionnel pour les formations proposées par AGCOM",
    image: "/images/graphic-design/formations-agcom.jpg",
    category: "graphic",
  },
  {
    id: "formations-conduite",
    title: "Formations conduite AGCOM",
    description: "Affiche pour les formations de conduite automobile proposées par AGCOM",
    image: "/images/graphic-design/formations-conduite-agcom.jpg",
    category: "graphic",
  },
  {
    id: "ingenieur-son",
    title: "Affiche ingénieur son",
    description: "Design promotionnel pour services d'ingénierie sonore professionnelle",
    image: "/images/graphic-design/affiche-ingenieur-son.jpg",
    category: "graphic",
  },
  {
    id: "cours-vacances",
    title: "Cours de vacances",
    description: "Affiche colorée pour programme de cours de vacances destiné aux étudiants",
    image: "/images/graphic-design/cours-vacances.jpg",
    category: "graphic",
  },
  {
    id: "danny",
    title: "Danny",
    description: "Design graphique personnalisé pour Danny",
    image: "/images/graphic-design/danny.jpg",
    category: "graphic",
  },
  {
    id: "boost-agcom",
    title: "Boost AGCOM",
    description: "Visuel promotionnel dynamique pour le programme Boost AGCOM",
    image: "/images/graphic-design/boostagcom.jpg",
    category: "graphic",
  },
  {
    id: "ndami-pub",
    title: "Ndami Pub",
    description: "Design publicitaire créatif pour Ndami Pub",
    image: "/images/graphic-design/ndami-pub.jpg",
    category: "graphic",
  },
];

// All portfolio items combined
export const allPortfolioItems: PortfolioItem[] = [
  ...webProjects,
  ...graphicProjects,
];
