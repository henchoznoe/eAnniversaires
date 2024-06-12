import { createContext, useState, useEffect, PropsWithChildren } from 'react';
import GlobalLoading from "@components/loading/GlobalLoading.tsx";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string;
  expiresAt: number;
  login: (token: string, expiresAt: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: PropsWithChildren) => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Récuperer le token et la date d'expiration depuis le local storage
    const localToken: string | null = localStorage.getItem('token');
    const localExpiresAt: string | null = localStorage.getItem('expiresAt');

    // S'il y a un token et une date d'expiration, on vérifie que le token n'est pas expiré
    if ( localToken && localExpiresAt ) {
      if ( new Date().getTime() / 1000 < parseInt(localExpiresAt) ) {
        setIsAuthenticated(true);
        setToken(localToken);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Remplit le local storage avec le token et la date d'expiration
  const login = (token: string, expiresAt: number) => {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresAt', expiresAt.toString());
    setToken(token);
    setExpiresAt(expiresAt);
    setIsAuthenticated(true);
  };

  // Vide le local storage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    setToken('');
    setExpiresAt(0);
    setIsAuthenticated(false);
  };

  // Si le chargement de l'état de l'authentification est en cours, on affiche un chargement
  if ( loading ) {
    return <GlobalLoading/>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, expiresAt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
