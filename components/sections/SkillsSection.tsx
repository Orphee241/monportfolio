"use client";

import { Skill } from "@/types";
import { useEffect, useRef, useState } from "react";

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const competences = skills.filter((skill) => skill.category === "competence");
  const tools = skills.filter((skill) => skill.category === "tool");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="competences" ref={sectionRef} className="section border-top-g relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#2E1A36]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[#321011]/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-[#000000]/35 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-[1200px]">
        <div className="section-heading text-center mb-12">
          <h3>
            Mes <span className="text-theme">Compétences</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-12">
          {/* Competences */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-6 bg-[#FD3C49] rounded-full" />
              <h4 className="text-white text-xl font-bold">Compétences</h4>
            </div>
            {competences.map((skill, index) => (
              <div 
                key={skill.id} 
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold text-lg group-hover:text-[#FD3C49] transition-colors">{skill.name}</span>
                  <span className="bar-percent text-[#FD3C49] font-bold">{skill.level}%</span>
                </div>
                <div className="bar group-hover:scale-y-110 transition-transform origin-left">
                  <div
                    className="bar-inner"
                    style={{
                      width: isVisible ? `${skill.level}%` : "0%",
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tools */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-6 bg-[#FD3C49] rounded-full" />
              <h4 className="text-white text-xl font-bold">Outils</h4>
            </div>
            {tools.map((skill, index) => (
              <div 
                key={skill.id} 
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold text-lg group-hover:text-[#FD3C49] transition-colors">{skill.name}</span>
                  <span className="bar-percent text-[#FD3C49] font-bold">{skill.level}%</span>
                </div>
                <div className="bar group-hover:scale-y-110 transition-transform origin-left">
                  <div
                    className="bar-inner"
                    style={{
                      width: isVisible ? `${skill.level}%` : "0%",
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
