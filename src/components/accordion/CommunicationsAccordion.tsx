import { CommunicationsDataType, UpdateCommunicationsType } from "@/types/communications.ts";
import { Accordion, Alert, Button, Form, Spinner } from "react-bootstrap";
import { useQuill } from "react-quilljs";
import { Save, Trash } from "lucide-react";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useAuth from "@/shared/hooks/auth-hook.ts";
import DeleteCommunicationsModal from "@components/modal/communications/DeleteCommunicationsModal.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CommunicationsFormData, communicationsSchema } from "@/constants/schemas/communications.ts";

type CommunicationsAccordionProps = {
  eventKey: number;
  communication: CommunicationsDataType;
  onCommunicationsUpdated: (updatedCommunication: CommunicationsDataType) => void;
  onCommunicationsDeleted: (deletedCommunication: CommunicationsDataType) => void;
}

const CommunicationsAccordion = (props: CommunicationsAccordionProps) => {

  const com = props.communication;

  const authCtx = useAuth();
  const { sendRequest, isLoading, errors } = useFetch();
  const { register, handleSubmit, setValue, reset, formState: { errors: formErrors } } = useForm({
    resolver: zodResolver(communicationsSchema),
    defaultValues: { ...com }
  });
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link'],
        [{ 'color': [] }, { 'background': [] }]
      ]
    },
    formats: [
      'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'indent', 'link', 'color', 'background'
    ]
  });

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    reset({ ...com, });
  }, [com, reset]);

  useEffect(() => {
    if ( quill ) {
      quill.clipboard.dangerouslyPasteHTML(com.html_birthday_msg);
      quill.on('text-change', () => {
        setValue('html_birthday_msg', quill.root.innerHTML);
      });
    }
  }, [quill, setValue]);

  const handleUpdate = async (data: CommunicationsFormData) => {
    // Envoi de la requête de mise à jour de la communication
    const res: UpdateCommunicationsType = await sendRequest(
      1,
      'PUT',
      null,
      JSON.stringify({ action: 'updateCommunications', pk_communication: com.pk_communication, ...data }),
      { Authorization: `Bearer ${authCtx.token}` }
    );
    if ( res.success ) {
      toast.success(res.message);
      props.onCommunicationsUpdated(res.data);
    }
  };

  return (
    <>
      <Accordion.Item eventKey={props.eventKey.toString()}>
        <Accordion.Header>{com.description}</Accordion.Header>
        <Accordion.Body className="d-flex flex-column gap-2">
          <Form onSubmit={handleSubmit(handleUpdate)}>
            <Form.Group className="w-100">
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
            <hr/>
            <Form.Group className="w-100">
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
            <hr/>
            <span>Message envoyé par Mail en cas d'anniversaire de naissance :</span>
            <div>
              <div ref={quillRef}/>
            </div>
            {formErrors.html_birthday_msg && (
              <Form.Text className="text-danger">
                {formErrors.html_birthday_msg.message}
              </Form.Text>
            )}
            <hr/>
            <Form.Group className="w-100">
              <Form.Label>
                Durée en jours avant l'envoi de notifications par Mail
                au responsable des collaborateurs ayant un anniversaire spécial :
              </Form.Label>
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
            <hr/>

            <div className="d-flex justify-content-between">
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                <Trash/>
              </Button>
              <button type="submit" className="btn btn-teal">
                {isLoading[1] ? (
                  <div className="d-flex gap-2 align-items-center justify-content-center">
                    <Spinner animation="border" size="sm"/>
                  </div>
                ) : (
                  <Save/>
                )}
              </button>
            </div>
            {errors[1] && <Alert variant="danger">{errors[1]}</Alert>}
          </Form>
        </Accordion.Body>
      </Accordion.Item>
      <DeleteCommunicationsModal
        showModal={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        communication={com}
        onDeleteSuccess={(deletedCommunication) => {
          setShowDeleteModal(false);
          props.onCommunicationsDeleted(deletedCommunication);
        }}
      />
    </>
  );
}

export default CommunicationsAccordion;
