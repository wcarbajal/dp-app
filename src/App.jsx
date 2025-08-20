import { AsidebarProvider } from './context/AsidebarContext';
import { AuthProvider } from './auth/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AppRouter } from './router/AppRouter';
import { EntidadProvider } from './context/EntidadContext';





function App() { //Identico al chatApp.jsx

  return (
    <AuthProvider >
      <EntidadProvider>
        <SocketProvider>
          <AsidebarProvider>
            <AppRouter />
          </AsidebarProvider>
        </SocketProvider>
      </EntidadProvider>
    </AuthProvider>

  );
}

export default App;
