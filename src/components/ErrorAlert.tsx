import { Alert, Container } from "react-bootstrap";
import { PropsWithChildren } from "react";

type ErrorAlertProps = {
  variant: 'success' | 'warning' | 'danger';
}

// Affiche une alerte avec les enfants à l'intérieur
const ErrorAlert = (props: PropsWithChildren<ErrorAlertProps>) => {
  return (
    <Container className="py-4">
      <Alert variant={props.variant}>{props.children}</Alert>
    </Container>
  );
}

export default ErrorAlert;