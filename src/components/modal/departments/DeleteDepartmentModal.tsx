import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import { toast } from "sonner";
import { DeleteDepartmentType, DepartmentsDataType } from "@/types/departments.ts";

type DeleteDepartmentModalProps = {
  showModal: boolean;
  handleClose: () => void;
  department: DepartmentsDataType;
  onDeleteSuccess: (deletedDepartment: DepartmentsDataType) => void;
}

const DeleteDepartmentModal = (props: DeleteDepartmentModalProps) => {

  const authCtx = useAuth();
  const { sendRequest, isLoading, errors } = useFetch();

  const handleDelete = async () => {
    // Envoi de la requête pour supprimer le département
    const res: DeleteDepartmentType = await sendRequest(
      1,
      'DELETE',
      `action=deleteDepartment&pk_department=${props.department.pk_department}`,
      null,
      { Authorization: `Bearer ${authCtx.token}` }
    );
    if ( res.success ) {
      toast.success(res.message);
      props.onDeleteSuccess(props.department);
    }
  };

  return (
    <Modal show={props.showModal} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-2">
        <span className="text-justify">
          Êtes-vous sûr de vouloir supprimer le département suivant ?
        </span>
        <h5 className="text-center">{props.department.name}</h5>
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

export default DeleteDepartmentModal;
