import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {

  const me = <a href="https://henchoz.org/" target="_blank" className="text-black text-decoration-none">Noé Henchoz</a>;

  return (
    <Container fluid className="border-top border-black">
      <Row className="align-items-center my-2">
        <Col sm={12} md={4} className="text-center mb-3 mb-md-0">
          <img src="/img/logo.png" alt="Logo eAnniversaires" className="footer-img"/>
        </Col>
        <Col sm={12} md={8} className="text-md-end">
          <Row className="text-md-start">
            <Col xs={12} className="text-center text-md-start mb-3 mb-md-0">
              <span className="lead">eAnniversaires &copy; 2024</span>
            </Col>
            <Col xs={12} className="text-center text-md-start mb-3 mb-md-0">
              <span className="lead fst-italic">
                Site web développé à l'EMF par {me}, dans le cadre de son travail de fin d'apprentissage (TPI)
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
