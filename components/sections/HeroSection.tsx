"use client";

import Image from "next/image";
import { BiDownload, BiRightArrowAlt } from "react-icons/bi";

interface HeroSectionProps {
  name: string;
  title: string;
  description: string;
  profileImage: string;
}

export default function HeroSection({
  name,
  title,
  description,
  profileImage,
}: HeroSectionProps) {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="accueil" data-scroll-index="0" className="min-h-screen relative overflow-hidden">
      {/* Gradient Background - Multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#2E1A36] to-[#321011] -z-20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#321011]/30 via-transparent to-[#2E1A36]/30 -z-20" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#321011]/40 via-[#2E1A36]/20 to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-[#2E1A36]/30 to-transparent -z-10" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#2E1A36]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-40 w-48 h-48 bg-[#321011]/20 rounded-full blur-3xl animate-pulse delay-75" />
        <div className="absolute bottom-40 left-40 w-56 h-56 bg-[#2E1A36]/15 rounded-full blur-3xl animate-pulse delay-150" />
        <div className="absolute bottom-20 right-60 w-40 h-40 bg-[#321011]/15 rounded-full blur-3xl animate-pulse delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#000000]/25 rounded-full blur-3xl animate-pulse delay-200" />
        <div className="absolute top-1/4 right-1/3 w-52 h-52 bg-[#000000]/20 rounded-full blur-3xl animate-pulse delay-400" />
      </div>
      
      <div className="container mx-auto h-screen flex items-center max-w-[1200px]">
        <div className="relative w-full flex items-center justify-between">
          
          {/* Text Content - À gauche */}
          <div className="space-y-5 max-w-xl z-10 animate-fade-in pr-8 lg:pr-0">
            <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-400 font-semibold animate-slide-down">
              Introduction
            </p>
            
            <h1 className="text-[2.2rem] lg:text-[2.7rem] xl:text-[3.2rem] font-bold leading-[1.2] animate-slide-up">
              Je suis <span className="text-cyan-400">{name}</span>{" "}
              <span className="block text-white text-lg lg:text-xl xl:text-2xl font-normal mt-2">(Glen Orphée NZIENGUI - AKOUMBOU)</span>
            </h1>
            
            <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-[1.3] animate-slide-up delay-100">
              <span className="text-[#12C2E9]">Développeur</span>
              <span className="bg-gradient-to-r from-[#12C2E9] via-[#12C2E9] via-40% to-[#EE535E] bg-clip-text text-transparent"> de solutions </span>
              <span className="text-[#EE535E]">numériques</span>
            </h2>
            
            <p className="text-[15px] lg:text-base text-gray-300 leading-relaxed pt-2 animate-slide-up delay-200">
              Compétences en <span className="text-400 font-medium">Développement web et Mobile, Design graphique, Montage vidéo, Automatisation des processus, et Marketing Digital (Facebook)</span>
            </p>



            {/* Stats professionnelles */}
            <div className="flex justify-start pt-8 animate-slide-up delay-400">
              <div className="group cursor-default">
                <div className="relative">
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-all duration-300 group-hover:scale-110 inline-block">4+</p>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">Années</p>
              </div>
            </div>
          </div>

          {/* Profile Image - À droite */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 animate-fade-in-right">
            <div className="relative w-[378px] xl:w-[432px] h-[468px] xl:h-[540px] group">
              <div className="absolute inset-0 overflow-hidden rounded-[50%_50%_50%_50%/55%_55%_45%_45%] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src={profileImage}
                  alt={`Glen Orphée NZIENGUI-AKOUMBOU (${name})`}
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
              {/* Glow effect subtil */}
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-gradient-to-br from-purple-700/20 to-red-700/10 rounded-full blur-3xl -z-10 group-hover:from-purple-700/30 group-hover:to-red-700/20 transition-all duration-500" />
              
              {/* Border animé */}
              <div className="absolute inset-0 rounded-[50%_50%_50%_50%/55%_55%_45%_45%] border-2 border-cyan-400/0 group-hover:border-cyan-400/20 transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer group">
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-current rounded-full animate-scroll-down" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
