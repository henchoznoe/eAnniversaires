import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { DeleteEmployeeType, EmployeesDataType } from "@/types/employees.ts";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import { toast } from "sonner";

type DeleteEmployeeModalProps = {
  showModal: boolean;
  handleClose: () => void;
  employee: EmployeesDataType;
  onDeleteSuccess: (deletedEmployee: EmployeesDataType) => void;
}

const DeleteEmployeeModal = (props: DeleteEmployeeModalProps) => {

  const authCtx = useAuth();
  const { sendRequest, isLoading, errors } = useFetch();

  const handleDelete = async () => {
    // Envoi de la requête de suppression du collaborateur
    const res: DeleteEmployeeType = await sendRequest(
      1,
      'DELETE',
      `action=deleteEmployee&pk_employee=${props.employee.pk_employee}`,
      null,
      { Authorization: `Bearer ${authCtx.token}` }
    );
    if ( res.success ) {
      toast.success(res.message);
      props.onDeleteSuccess(props.employee);
    }
  };

  return (
    <Modal show={props.showModal} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-2">
        <span className="text-justify">
          Êtes-vous sûr de vouloir supprimer le collaborateur suivant ?
        </span>
        <h5 className="text-center">{props.employee.first_name} {props.employee.last_name}</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          {isLoading[1] ? (
            <div className="d-flex gap-2 align-items-center justify-content-center">
              <span>Chargement...</span>
              <Spinner animation="border" size="sm"/>
            </div>
          ) : ('Confirmer')}
        </Button>
        {errors[1] && <Alert variant="danger">{errors[1]}</Alert>}
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteEmployeeModal;
