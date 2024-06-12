import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {

  const loc = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex align-items-center justify-content-center h-svh">
        <div className="text-center px-3">
          <h1 className="display-1 fw-bold">404</h1>
          <p className="fs-3"><span className="text-danger">Oh non!</span> Page non trouvée.</p>
          <p className="lead">
            La page demandée [{loc.pathname}] n'existe pas, retournez à l'accueil pour trouver ce que vous chercher.
          </p>
          <button className="btn btn-teal" onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </div>
    </>
  );
}

export default NotFound;