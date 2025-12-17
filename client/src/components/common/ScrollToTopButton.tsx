"use client";

import { useEffect, useState } from "react";
import { BiArrowToTop } from "react-icons/bi";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-9 right-96 p-3 rounded-full bg-brand text-surface shadow-lg hover:bg-brand/90 transition-all hover:-translate-y-1 cursor-pointer z-50 animate-fade-in"
      aria-label="Scroll to top"
    >
      <BiArrowToTop className="size-6" />
    </button>
  );
}
