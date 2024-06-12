import { Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column align-items-center gap-2">
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
        <span>Chargement...</span>
      </div>
    </div>
  );
}

export default Loading;