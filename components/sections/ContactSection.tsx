"use client";

import { ContactInfo } from "@/types";
import {
  BiEnvelope,
  BiPhone,
  BiLogoWhatsapp,
  BiMap,
} from "react-icons/bi";

interface ContactSectionProps {
  contactInfo: ContactInfo;
}

export default function ContactSection({ contactInfo }: ContactSectionProps) {
  return (
    <section id="contact" data-scroll-index="4" className="section border-top-g relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#321011]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#2E1A36]/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#000000]/35 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#000000]/25 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-[1200px]">
        <div className="section-heading text-center mb-8">
          <h3>
            Contactez-<span className="text-theme">moi</span>
          </h3>
        </div>

        <div className="flex flex-wrap gap-6 justify-center items-center">
          {/* Email Card */}
          <a 
            href={`mailto:${contactInfo.email}`} 
            className="feature-box-01 group hover:scale-105 transition-transform duration-300 w-full sm:w-auto sm:min-w-[280px] sm:max-w-[320px]"
          >
            <div className="icon">
              <BiEnvelope />
            </div>
            <div className="feature-content">
              <h5>Email</h5>
              <p className="break-all">{contactInfo.email}</p>
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 group-hover:w-full transition-all duration-500" />
          </a>

          {/* WhatsApp Card */}
          <a
            href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="feature-box-01 group hover:scale-105 transition-transform duration-300 w-full sm:w-auto sm:min-w-[280px] sm:max-w-[320px]"
          >
            <div className="icon bg-gradient-to-br from-green-500 to-green-600">
              <BiLogoWhatsapp />
            </div>
            <div className="feature-content">
              <h5>WhatsApp</h5>
              <p>{contactInfo.whatsapp}</p>
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
}
