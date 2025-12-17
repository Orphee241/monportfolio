"use client";

import Image from "next/image";
import { PersonalInfo, Education, Experience } from "@/types";
import {
  BiEnvelope,
  BiPhone,
  BiMap,
  BiCalendar,
  BiWorld,
  BiCheckDouble,
} from "react-icons/bi";

interface AboutSectionProps {
  personalInfo: PersonalInfo;
  education: Education[];
  experiences: Experience[];
  profileImage: string;
}

export default function AboutSection({
  personalInfo,
  education,
  experiences,
  profileImage,
}: AboutSectionProps) {
  return (
    <section id="concept&formation" data-scroll-index="1" className="section about-section border-top-g relative overflow-visible">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#321011]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2E1A36]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#000000]/30 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-[1200px]">
        {/* Section Heading */}
        <div className="section-heading text-center mb-12">
          <h3>
            À propos de <span className="text-theme">moi</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          {/* Sticky Sidebar with Profile Image */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-32 w-full max-w-md mx-auto">
              <div className="about-img relative w-full aspect-square rounded-full overflow-hidden shadow-2xl shadow-[#FD3C49]/20">
                <Image
                  src={profileImage}
                  alt={`Glen Orphée NZIENGUI - AKOUMBOU (${personalInfo.name})`}
                  fill
                  loading="lazy"
                  className="object-cover object-center"
                  style={{ objectPosition: 'center 20%' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="about-text space-y-16">
              {/* Présentation */}
              <div className="about-row">
                <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Présentation</h3>
                
                <div className="space-y-8">
                  <h4 className="text-[#FD3C49] text-lg font-semibold">Détails personnels</h4>
                  
                  <div className="space-y-5">
                    <div className="info-item group">
                      <BiEnvelope className="text-[#FD3C49] text-xl flex-shrink-0" />
                      <span className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">{personalInfo.email}</span>
                    </div>
                    
                    <div className="info-item group">
                      <BiPhone className="text-[#FD3C49] text-xl flex-shrink-0" />
                      <span className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">{personalInfo.phone.join(" / ")}</span>
                    </div>
                    
                    <div className="info-item group">
                      <BiMap className="text-[#FD3C49] text-xl flex-shrink-0" />
                      <span className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">{personalInfo.location}</span>
                    </div>
                    
                    <div className="info-item group">
                      <BiCalendar className="text-[#FD3C49] text-xl flex-shrink-0" />
                      <span className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">{personalInfo.birthDate}</span>
                    </div>
                    
                    <div className="info-item group">
                      <BiWorld className="text-[#FD3C49] text-xl flex-shrink-0" />
                      <span className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">{personalInfo.nationality}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formation */}
              <div className="about-row">
                <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Formation</h3>
                
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="group">
                      <h5 className="text-white text-lg font-semibold mb-2 group-hover:text-[#FD3C49] transition-colors leading-relaxed">
                        {edu.title}
                      </h5>
                      <p className="text-gray-400 leading-relaxed">
                        ({edu.period} à <strong className="text-gray-300">{edu.institution}</strong>)
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expériences */}
              <div className="about-row">
                <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Expériences professionnelles</h3>
                
                <ul className="space-y-6">
                  {experiences.map((exp, index) => (
                    <li key={index} className="group">
                      <p className="leading-relaxed">
                        <BiCheckDouble className="text-[#FD3C49] inline mr-2 text-xl align-middle" />
                        <strong className="text-white group-hover:text-[#FD3C49] transition-colors text-lg">{exp.role}</strong>
                        <span className="text-gray-400"> à </span>
                        <strong className="text-gray-300">{exp.company}</strong>
                        {exp.period && (
                          <>
                            <br />
                            <span className="text-gray-400 ml-8">({exp.period})</span>
                          </>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
