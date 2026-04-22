import { useEffect } from "react";

export default function useClickOutside(ref, handler) {
  useEffect(() => {
    const handleClick = (event) => {
      // if click is inside the element → ignore
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // otherwise → run handler
      handler();
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, handler]);
}
