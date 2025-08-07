import { AsidebarProvider } from './context/AsidebarContext';
import { AuthProvider } from './auth/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AppRouter } from './router/AppRouter';





function App() { //Identico al chatApp.jsx

  return (
    <AuthProvider >
      <SocketProvider>
        <AsidebarProvider>
          <AppRouter />
        </AsidebarProvider>
      </SocketProvider>
    </AuthProvider>

  );
}

export default App;
