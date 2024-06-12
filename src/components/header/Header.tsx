import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { headerButtons, headerMenus } from "@/constants/header/header-menus.ts";
import { cn } from "@/utils/classNames.ts";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { toast } from "sonner";

const Header = () => {

  const navigate = useNavigate();
  const loc = useLocation();
  const authCtx = useAuth();

  // Récupération des menus de définition si actif ou non
  const navMenus = headerMenus.map((menu, index) => {
    const isActive = loc.pathname === menu.to;
    if ( menu.restricted === authCtx.isAuthenticated ) {
      return (
        <Nav.Link
          key={index}
          as={Link}
          to={menu.to}
          className={cn(isActive ? 'active' : '', 'items-nav')}
        >
          {menu.label}
        </Nav.Link>
      )
    }
  });

  // Récupération des boutons
  const navButtons = headerButtons.map((button, index) => {
    const loginLogoutHandler = () => {
      switch ( button.action ) {
        case 'login':
          navigate('/login');
          break;
        case 'logout':
          authCtx.logout();
          break;
        default:
          toast.warning('L\'action de ce bouton est inconnue.')
          break;
      }
    }
    if ( button.restricted === authCtx.isAuthenticated ) {
      return <button key={index} onClick={loginLogoutHandler} className={cn(button.className, 'btn')}>{button.label}</button>
    }
  });

  return (
    <Navbar expand="lg" className="bg-background border-bottom border-black" sticky="top">
      <Container fluid>
        <Navbar.Brand style={{ width: '240px'}}>
          <Nav.Link as={Link} to="/" className="d-flex gap-2 align-items-center">
            <img src="/img/logo-nav.png" alt="Logo eAnniversaires" height="40" width="40"/>
            <span className="fw-medium fs-3">eAnniversaires</span>
          </Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar"/>
        <Navbar.Collapse id="navbar">
          <Nav className="d-flex ms-0 ms-lg-auto me-auto my-2 my-lg-0 gap-lg-3">
            {navMenus}
          </Nav>
          <div className="d-lg-flex justify-content-end" style={{ width: '240px'}}>
            {navButtons}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;