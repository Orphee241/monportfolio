"use client";

import { useEffect, useRef } from "react";
import { PortfolioItem } from "@/types";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

interface PortfolioCarouselProps {
  items: PortfolioItem[];
  onItemClick?: (item: PortfolioItem) => void;
}

export default function PortfolioCarousel({
  items,
  onItemClick,
}: PortfolioCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Add ARIA labels and role to navigation buttons after Swiper initializes
  useEffect(() => {
    if (swiperRef.current) {
      const prevButton = swiperRef.current.navigation?.prevEl;
      const nextButton = swiperRef.current.navigation?.nextEl;

      if (prevButton instanceof HTMLElement) {
        prevButton.setAttribute("aria-label", "Projet précédent");
        prevButton.setAttribute("role", "button");
        prevButton.setAttribute("tabindex", "0");
      }
      if (nextButton instanceof HTMLElement) {
        nextButton.setAttribute("aria-label", "Projet suivant");
        nextButton.setAttribute("role", "button");
        nextButton.setAttribute("tabindex", "0");
      }
    }
  }, []);

  return (
    <div className="portfolio-carousel">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="mySwiper"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-500"
              onClick={() => onItemClick?.(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onItemClick?.(item);
                }
              }}
              aria-label={`Voir le projet ${item.title}`}
            >
              <div className="relative h-56 w-full bg-black/20">
                <Image
                  src={item.image}
                  alt={item.description || item.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-300 leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.description}</p>
                )}
                <div className="mt-3 flex items-center gap-2 text-cyan-400 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                  <span>Voir le projet</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 blur-xl" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
