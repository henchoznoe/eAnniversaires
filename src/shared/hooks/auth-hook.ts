import { useContext } from 'react';
import { AuthContext } from "@/shared/context/AuthContext.tsx";

const useAuth = () => {
  // Récupérer le contexte de l'authentification
  const context = useContext(AuthContext);

  // Vérifier si le contexte existe
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Retourner le contexte de l'authentification
  return context;
};

export default useAuth;