/**
 * Scroll utility functions for smooth navigation and active section detection
 */

/**
 * Smoothly scrolls to a section by its ID
 * @param sectionId - The ID of the section to scroll to
 * @param offset - The offset from the top (default: 80px for header)
 */
export function scrollToSection(sectionId: string, offset: number = 80): void {
  const section = document.getElementById(sectionId);
  if (section) {
    const elementPosition = section.offsetTop;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Update URL hash without page reload
    updateUrlHash(sectionId);
  }
}

/**
 * Updates the URL hash without triggering a page reload
 * @param hash - The hash to set (without the # symbol)
 */
export function updateUrlHash(hash: string): void {
  window.history.pushState(null, "", `#${hash}`);
}

/**
 * Detects the currently active section based on scroll position
 * @param sectionIds - Array of section IDs to check
 * @param offset - Offset from the top for detection (default: 100px)
 * @returns The ID of the active section
 */
export function getActiveSection(
  sectionIds: string[],
  offset: number = 100
): string {
  const scrollPosition = window.scrollY + offset;

  // Get all sections
  const sections = sectionIds
    .map((id) => ({
      id,
      element: document.getElementById(id),
    }))
    .filter((section) => section.element !== null);

  // Find the active section (iterate from bottom to top)
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section.element && section.element.offsetTop <= scrollPosition) {
      return section.id;
    }
  }

  // Default to first section if none found
  return sectionIds[0] || "";
}

/**
 * Creates a scroll event listener that updates the active section
 * @param sectionIds - Array of section IDs to monitor
 * @param onActiveChange - Callback function called when active section changes
 * @param offset - Offset for active section detection (default: 100px)
 * @returns Cleanup function to remove the event listener
 */
export function createScrollListener(
  sectionIds: string[],
  onActiveChange: (activeId: string) => void,
  offset: number = 100
): () => void {
  let currentActive = getActiveSection(sectionIds, offset);

  const handleScroll = () => {
    const newActive = getActiveSection(sectionIds, offset);
    if (newActive !== currentActive) {
      currentActive = newActive;
      onActiveChange(newActive);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}
