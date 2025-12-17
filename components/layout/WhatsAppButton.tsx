"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  message = "Bonjour, je souhaite discuter d'un projet avec vous.",
}: WhatsAppButtonProps) {
  const formattedPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-7 right-7 z-40 bg-white text-[#25D366] p-4 rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.8),0_0_60px_rgba(37,211,102,0.4)] hover:text-[#128C7E] hover:shadow-[0_12px_40px_rgba(37,211,102,1),0_0_100px_rgba(37,211,102,0.8)] transition-all duration-300"
      aria-label="Contact via WhatsApp"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          "0 8px 32px rgba(37,211,102,0.8), 0 0 60px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.7)",
          "0 8px 32px rgba(37,211,102,0.8), 0 0 80px rgba(37,211,102,0.6), 0 0 0 15px rgba(37,211,102,0)",
          "0 8px 32px rgba(37,211,102,0.8), 0 0 60px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.7)",
        ],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      <FaWhatsapp size={36} />
    </motion.a>
  );
}
