import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "@/shared/hooks/auth-hook.ts";

const ProtectedRoute = ({ children }: PropsWithChildren) => {

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de connexion
    if ( !isAuthenticated ) {
      navigate('/login', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  // On retourne les enfants de la route protégée, autrement dit, on autorise l'accès à la page enfant
  return <>{children}</>;
};

export default ProtectedRoute;