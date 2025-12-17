"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PortfolioItem } from "@/types";
import Image from "next/image";
import { BiX } from "react-icons/bi";

// Dynamic import for PortfolioCarousel with code splitting
const PortfolioCarousel = dynamic(
  () => import("@/components/ui/PortfolioCarousel"),
  {
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false,
  }
);

interface PortfolioSectionProps {
  webProjects: PortfolioItem[];
  graphicProjects: PortfolioItem[];
}

export default function PortfolioSection({
  webProjects,
  graphicProjects,
}: PortfolioSectionProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleWebProjectClick = (item: PortfolioItem) => {
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleGraphicProjectClick = (item: PortfolioItem) => {
    setLightboxImage(item.image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Close lightbox on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxImage) {
        closeLightbox();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [lightboxImage]);

  return (
    <section id="realisations" data-scroll-index="3" className="section border-top-g relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#2E1A36]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-[#321011]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#000000]/25 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-[1200px]">
        <div className="section-heading text-center mb-12">
          <h3>
            Mes <span className="text-theme">Réalisations</span>
          </h3>
          <p className="text-gray-400 mt-3">
            Sélection de projets web et design graphique
          </p>
        </div>

        {/* Web Development Projects */}
        <div className="mb-32">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-cyan-400 rounded-full" />
            <h4 className="text-white text-2xl lg:text-3xl font-bold tracking-tight mb-[1em]">
              Développement <span className="text-cyan-400">Web</span>
            </h4>
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent via-cyan-400/50 to-cyan-400 rounded-full" />
          </div>
          <PortfolioCarousel
            items={webProjects}
            onItemClick={handleWebProjectClick}
          />
        </div>

        {/* Graphic Design Projects */}
        <div className="mt-8">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent via-pink-500/50 to-pink-500 rounded-full" />
            <h4 className="text-white text-2xl lg:text-3xl font-bold tracking-tight">
              Graphic <span className="text-pink-500">Design</span>
            </h4>
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent via-pink-500/50 to-pink-500 rounded-full" />
          </div>
          <PortfolioCarousel
            items={graphicProjects}
            onItemClick={handleGraphicProjectClick}
          />
        </div>
      </div>

      {/* Lightbox Modal - Amélioré */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse d'image en plein écran"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-cyan-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm hover:scale-110"
            aria-label="Fermer la lightbox"
          >
            <BiX className="text-3xl" />
          </button>
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full animate-slide-up">
            <Image
              src={lightboxImage}
              alt={
                graphicProjects.find((p) => p.image === lightboxImage)
                  ?.description ||
                graphicProjects.find((p) => p.image === lightboxImage)?.title ||
                "Image de design graphique en plein écran"
              }
              fill
              className="object-contain drop-shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
