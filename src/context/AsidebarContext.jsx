import { createContext, useState, useEffect } from 'react';

export const AsidebarContext = createContext();

export const AsidebarProvider = ({ children }) => {
  const [asidebarOpen, setAsidebarOpen] = useState(true);

  useEffect(() => {
    // Función para verificar el ancho de la ventana
    const handleResize = () => {
      // md en Tailwind es 768px
      if (window.innerWidth < 768) {
        setAsidebarOpen(false);
      } else {
        setAsidebarOpen(true);
      }
    };

    // Ejecuta al montar
    handleResize();

    // Escucha cambios de tamaño
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AsidebarContext.Provider value={{ asidebarOpen, setAsidebarOpen }}>
      {children}
    </AsidebarContext.Provider>
  );
};