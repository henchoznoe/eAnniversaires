import { AddCommunicationsType, CommunicationsDataType } from "@/types/communications.ts";
import { Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommunicationsFormData, communicationsSchema } from "@/constants/schemas/communications.ts";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { useQuill } from "react-quilljs";
import { toast } from "sonner";

type AddCommunicationsModalProps = {
  showModal: boolean;
  handleClose: () => void;
  onAddSuccess: (addedCommunication: CommunicationsDataType) => void;
}

const AddCommunicationsModal = (props: AddCommunicationsModalProps) => {

  const authCtx = useAuth();
  const { sendRequest, isLoading, errors } = useFetch();
  const { register, handleSubmit, setValue, formState: { errors: formErrors }, reset } = useForm({
    resolver: zodResolver(communicationsSchema),
    defaultValues: {
      description: '',
      birthday_msg: '',
      html_birthday_msg: '',
      notification_delay: 0,
    }
  });
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link']
      ]
    }, formats: [
      'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'indent', 'link'
    ]
  });

  useEffect(() => {
    if ( quill ) {
      quill.on('text-change', () => {
        setValue('html_birthday_msg', quill.root.innerHTML);
      });
    }
  }, [quill, setValue]);

  const handleAdd = async (data: CommunicationsFormData) => {
    // Envoi de la requête pour ajouter la communication
    const res: AddCommunicationsType = await sendRequest(
      1,
      'POST',
      null,
      JSON.stringify({ action: 'addCommunications', ...data }),
      { Authorization: `Bearer ${authCtx.token}` }
    );
    if ( res.success ) {
      toast.success(res.message);
      props.onAddSuccess(res.data);
      props.handleClose();
      reset();
    }
  };

  return (
    <Modal show={props.showModal} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une communication</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleAdd)} className="d-flex flex-column gap-3">
          <Form.Group className="mb-3">
            <Form.Label>Description de la communication :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              {...register('description')}
              isInvalid={!!formErrors.description}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.description?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message envoyé par SMS en cas d'anniversaire de naissance :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Message SMS"
              {...register('birthday_msg')}
              isInvalid={!!formErrors.birthday_msg}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.birthday_msg?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message envoyé par Mail en cas d'anniversaire de naissance :</Form.Label>
            <div ref={quillRef}/>
            {formErrors.html_birthday_msg && (
              <Form.Text className="text-danger">
                {formErrors.html_birthday_msg.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Durée en jours avant l'envoi de notifications par Mail :</Form.Label>
            <Form.Control
              type="number"
              placeholder="Délai de notification"
              {...register('notification_delay', {
                valueAsNumber: true
              })}
              isInvalid={!!formErrors.notification_delay}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.notification_delay?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <button className="btn btn-teal" type="submit" disabled={isLoading[1]}>
            {isLoading[1] ? (
              <div className="d-flex gap-2 align-items-center justify-content-center">
                <span>Chargement...</span>
                <Spinner animation="border" size="sm"/>
              </div>
            ) : ('Ajouter')}
          </button>

          {errors[1] && <Alert variant="danger">{errors[1]}</Alert>}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCommunicationsModal;
