import { CommunicationsDataType, DeleteCommunicationsType } from "@/types/communications.ts";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import { toast } from "sonner";

type DeleteCommunicationsModalProps = {
  showModal: boolean;
  handleClose: () => void;
  communication: CommunicationsDataType;
  onDeleteSuccess: (deletedCommunication: CommunicationsDataType) => void;
}

const DeleteCommunicationsModal = (props: DeleteCommunicationsModalProps) => {

  const authCtx = useAuth();
  const { sendRequest, isLoading, errors } = useFetch();

  const handleDelete = async () => {
    // Envoi de la requête pour supprimer la communication
    const res: DeleteCommunicationsType = await sendRequest(
      1,
      'DELETE',
      `action=deleteCommunications&pk_communication=${props.communication.pk_communication}`,
      null,
      { Authorization: `Bearer ${authCtx.token}` }
    );
    if ( res.success ) {
      toast.success(res.message);
      props.onDeleteSuccess(props.communication);
    }
  };

  return (
    <>
      <Modal show={props.showModal} onHide={props.handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-2">
        <span className="text-justify">
          Êtes-vous sûr de vouloir supprimer la communication suivante ?
        </span>
          <h5 className="text-center">{props.communication.description}</h5>
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
    </>
  );
}

export default DeleteCommunicationsModal;