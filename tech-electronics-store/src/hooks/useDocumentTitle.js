import { useEffect } from "react";

const BASE_TITLE = "TechStore";

/**
 * Sets the browser tab title.
 * @param {string} title - Page-specific title. If empty, shows just BASE_TITLE.
 */
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    // Reset to base title on unmount
    return () => { document.title = BASE_TITLE; };
  }, [title]);
}

export default useDocumentTitle;
