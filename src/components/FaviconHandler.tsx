import { useEffect } from 'react';
import logoImage from 'figma:asset/9bd4afac6e715442bf1d3f5ac66a3fc863788484.png';

export function FaviconHandler() {
  useEffect(() => {
    // Cambiar el favicon dinámicamente
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = logoImage;
    
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(link);
    }
    
    // Cambiar el título de la página
    document.title = 'IMPERTULA - Protegemos lo que usted construye';
  }, []);

  return null;
}
