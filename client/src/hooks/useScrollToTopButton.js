import { useEffect, useState } from "react";

export default function useScrollToTopButton(threshold = 300) {
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > threshold && currentY > lastScrollY) {
        setShow(true); // scrolling down
      } else {
        setShow(false); // scrolling up
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return { showScrollTop: show, scrollToTop };
}
