import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/shared/context/AuthContext.tsx";
import { routes } from "@/utils/routes/routes.tsx";
import '@bootstrap/dist/css/bootstrap.min.css';
import '@/index.css';
import 'quill/dist/quill.snow.css';

// Créer le router
const router = createBrowserRouter(routes);
// Récupérer l'élément racine
const app = document.getElementById('app')!;

// Point d'entrée de l'application
createRoot(app).render(
  // Ajouter le contexte d'authentification et le router à la racine de l'application
  <AuthProvider>
    <RouterProvider router={router}/>
  </AuthProvider>
);