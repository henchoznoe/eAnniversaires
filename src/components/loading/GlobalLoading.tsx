import { Spinner } from "react-bootstrap";

const GlobalLoading = () => {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column gap-3 align-items-center">
        <img src="/img/logo.png" alt="Logo eAnniversaires" height={300}/>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
        <span>Chargement...</span>
      </div>
    </div>
  );
}

export default GlobalLoading;