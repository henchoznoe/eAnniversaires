type HeaderMenusType = {
  label: string;
  to: string;
  restricted: boolean;
}

// Liste des menus à afficher dans la barre de navigation
export const headerMenus: HeaderMenusType[] = [
  {
    label: 'Accueil',
    to: '/',
    restricted: true
  },
  {
    label: 'Collaborateurs',
    to: '/employees',
    restricted: true
  },
  {
    label: 'Départements',
    to: '/departments',
    restricted: true
  },
  {
    label: 'Communications',
    to: '/communications',
    restricted: true
  }
];

type HeaderButtonsType = {
  label: string;
  action: string;
  className: string;
  restricted: boolean;
}

// Liste des boutons à afficher dans la barre de navigation
export const headerButtons: HeaderButtonsType[] = [
  {
    label: 'Login',
    action: 'login',
    className: 'btn-teal',
    restricted: false
  },
  {
    label: 'Se déconnecter',
    action: 'logout',
    className: 'btn-danger',
    restricted: true
  }
];