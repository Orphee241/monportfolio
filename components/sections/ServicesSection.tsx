"use client";

import { Service } from "@/types";
import { BiCodeAlt, BiServer, BiPalette, BiDesktop, BiLaptop, BiMusic } from "react-icons/bi";

interface ServicesSectionProps {
  services: Service[];
}

const iconMap: Record<string, React.ReactNode> = {
  BiCodeAlt: <BiCodeAlt />,
  BiServer: <BiServer />,
  BiPalette: <BiPalette />,
  BiDesktop: <BiDesktop />,
  BiLaptop: <BiLaptop />,
  BiMusic: <BiMusic />,
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" data-scroll-index="2" className="section services-section border-top-g relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#321011]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#2E1A36]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-[#000000]/30 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-[1200px]">
        <div className="section-heading text-center mb-8">
          <h3>
            Mes <span className="text-theme">Services</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="feature-box-01 group !flex-row !items-center !justify-start !py-6 !px-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="icon !mr-4">{iconMap[service.icon] || <BiCodeAlt />}</div>
              <div className="feature-content !text-left">
                <h5 className="!mb-0">{service.title}</h5>
              </div>
              {/* Decorative element */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FD3C49] to-[#22d3ee] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
