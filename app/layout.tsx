import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik" 
});

export const metadata: Metadata = {
  title: "GONA - Développeur de solutions numériques",
  description:
    "Portfolio de Glen Orphée NZIENGUI-AKOUMBOU - Développeur de solutions numériques. Grâce à des compétences acquises en développement web et en graphic design, j'ambitionne mettre mes compétences à la réalisation de vos projets.",
  keywords: [
    "GONA",
    "Glen Orphée NZIENGUI-AKOUMBOU",
    "Développeur Web",
    "Next.js",
    "Node.js",
    "Graphic Designer",
    "Portfolio",
    "Gabon",
    "Développeur Gabon",
    "Web Design",
    "Photoshop",
    "React",
    "TypeScript",
    "Tailwind CSS",
  ],
  authors: [{ name: "Glen Orphée NZIENGUI-AKOUMBOU", url: "https://gona241.com" }],
  creator: "Glen Orphée NZIENGUI-AKOUMBOU",
  publisher: "GONA",
  metadataBase: new URL("https://gona241.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://gona241.com",
    title: "GONA - Développeur de solutions numériques",
    description:
      "Portfolio de Glen Orphée NZIENGUI-AKOUMBOU - Développeur de solutions numériques. Découvrez mes réalisations en développement web et design graphique.",
    siteName: "GONA Portfolio",
    images: [
      {
        url: "/images/profile/glen-orphee.png",
        width: 1200,
        height: 630,
        alt: "GONA - Glen Orphée NZIENGUI-AKOUMBOU",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GONA - Développeur de solutions numériques",
    description:
      "Portfolio de Glen Orphée NZIENGUI-AKOUMBOU - Développeur de solutions numériques.",
    images: ["/images/profile/glen-orphee.png"],
    creator: "@gona241",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Glen Orphée NZIENGUI-AKOUMBOU",
    alternateName: "GONA",
    jobTitle: "Développeur de solutions numériques",
    description:
      "Développeur de solutions numériques basé au Gabon. Spécialisé en développement web moderne et design graphique.",
    url: "https://gona241.com",
    email: "contact@gona241.com",
    telephone: "+241 77187894",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nkok Ntoum",
      addressCountry: "GA",
    },
    nationality: {
      "@type": "Country",
      name: "Gabon",
    },
    birthDate: "1996-01-23",
    knowsAbout: [
      "Next.js",
      "Node.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Graphic Design",
      "Photoshop",
      "Web Development",
    ],
    sameAs: [
      "https://gona241.com",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GONA Portfolio",
    description:
      "Portfolio professionnel de Glen Orphée NZIENGUI-AKOUMBOU - Développeur de Solution numérique (Next.js) et Graphic Designer",
    url: "https://gona241.com",
    author: {
      "@type": "Person",
      name: "Glen Orphée NZIENGUI-AKOUMBOU",
    },
    inLanguage: "fr-FR",
  };

  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${rubik.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
