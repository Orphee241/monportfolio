"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiX } from "react-icons/bi";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: { label: string; href: string }[];
  onItemClick: (href: string) => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  menuItems,
  onItemClick,
}: MobileMenuProps) {
  // Close menu on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleItemClick = (href: string) => {
    onItemClick(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-64 bg-black shadow-xl z-50"
            style={{ 
              background: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "saturate(180%) blur(20px)"
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">
                  Menu
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Fermer le menu"
                >
                  <BiX className="text-2xl text-white" />
                </button>
              </div>

              {/* Menu items */}
              <nav className="flex-1 overflow-y-auto p-4" role="navigation" aria-label="Menu mobile">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => handleItemClick(item.href)}
                        className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
