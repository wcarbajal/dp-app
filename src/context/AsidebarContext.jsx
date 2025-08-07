import { createContext, useState } from 'react';

export const AsidebarContext = createContext();

export const AsidebarProvider = ({ children }) => {

  const [asidebarOpen, setAsidebarOpen] = useState(true);

  return (
    <AsidebarContext.Provider value={{ asidebarOpen, setAsidebarOpen }}>
      {children}
    </AsidebarContext.Provider>
  );
}
