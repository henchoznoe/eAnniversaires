import Homepage from "@pages/Homepage.tsx";
import Login from "@pages/Login.tsx";
import ProtectedRoute from "@/utils/routes/ProtectedRoute.tsx";
import NotFound from "@pages/NotFound.tsx";
import Layout from "@pages/Layout.tsx";
import Employees from "@pages/Employees.tsx";
import Departments from "@pages/Departments.tsx";
import Communications from "@pages/Communications.tsx";

// Création des routes de l'application
export const routes = [
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <Homepage/>,
      },
      {
        path: 'login',
        element: <Login/>,
      },
      {
        path: 'employees',
        element: (
          <ProtectedRoute>
            <Employees/>
          </ProtectedRoute>
        ),
      },
      {
        path: 'departments',
        element: (
          <ProtectedRoute>
            <Departments/>
          </ProtectedRoute>
        ),
      },
      {
        path: 'communications',
        element: (
          <ProtectedRoute>
            <Communications/>
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound/>,
      },
    ],
  },
];