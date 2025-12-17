"use client";

import { Service } from "@/types";
import * as Icons from "react-icons/bi";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Dynamically get the icon component from react-icons/bi
  const IconComponent = (Icons as any)[service.icon.replace("bi-", "Bi")
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")];

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center mb-4">
        {IconComponent && (
          <IconComponent className="text-4xl text-blue-600 dark:text-blue-400 mr-3" />
        )}
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {service.title}
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {service.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {service.technologies.map((tech, index) => (
          <span
            key={index}
            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
