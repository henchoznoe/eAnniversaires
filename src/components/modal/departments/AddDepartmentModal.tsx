import { EmployeesDataType } from "@/types/employees.ts";
import { AddDepartmentType, DepartmentsDataType } from "@/types/departments.ts";
import { Alert, Form, Modal, Spinner } from "react-bootstrap";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepartmentFormData, departmentSchema } from "@/constants/schemas/departments.ts";
import { CommunicationsDataType } from "@/types/communications.ts";

type AddDepartmentModalProps = {
  showModal: boolean;
  handleClose: () => void;
  employees: EmployeesDataType[];
  communications: CommunicationsDataType[];
  onAddSuccess: (addedDepartment: DepartmentsDataType) => void;
}

const AddDepartmentModal = (props: AddDepartmentModalProps) => {

  const { sendRequest, isLoading, errors } = useFetch();
  const authCtx = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors: formErrors }
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      manager: props.employees.length > 0 ? props.employees[0].pk_employee : undefined,
      communication: props.communications.length > 0 ? props.communications[0].pk_communication : undefined
    }
  });

  const handleAddDepartment = async (data: DepartmentFormData) => {
    const requestData = {
      ...data,
      manager: {
        pk_employee: data.manager
      },
      communication: {
        pk_communication: data.communication
      },
      employees: data.employees?.map(pk_employee => ({ pk_employee })) || [],
    };
    // Envoi de la requête pour ajouter un département
    const res: AddDepartmentType = await sendRequest(
      1,
      'POST',
      null,
      JSON.stringify({ action: 'addDepartment', ...requestData }),
      { Authorization: `Bearer ${authCtx.token}` }
    );
    if ( res.success ) {
      toast.success(res.message);
      props.onAddSuccess(res.data);
      reset();
      props.handleClose();
    }
  };

  // Gestion des changements de la liste des collaborateurs
  const handleEmployeesChange = (pkEmployee: number) => {
    const currentValues = getValues('employees');
    if ( currentValues && currentValues.includes(pkEmployee) ) {
      setValue('employees', currentValues.filter(value => value !== pkEmployee));
    } else {
      setValue('employees', [...(currentValues || []), pkEmployee]);
    }
  };

  return (
    <>
      <Modal show={props.showModal} onHide={props.handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un département</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleAddDepartment)} className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label>Nom du département</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom du département"
                {...register('name')}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Réception des félicitations par</Form.Label>
              <Form.Check
                type="checkbox"
                label="Mail"
                {...register('notify_by_mail')}
                isInvalid={!!formErrors.notify_by_mail}
              />
              <Form.Check
                type="checkbox"
                label="SMS"
                {...register('notify_by_sms')}
                isInvalid={!!formErrors.notify_by_sms}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Responsable</Form.Label>
              <Form.Select
                onChange={(e) => setValue('manager', parseInt(e.target.value))}
                isInvalid={!!formErrors.manager}
              >
                {props.employees.map((emp) => (
                  <option key={emp.pk_employee} value={emp.pk_employee}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.manager?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Collaborateurs</Form.Label>
              <div style={{ height: '140px', overflowY: 'auto' }}>
                <div className="p-1" style={{ height: '140px', overflowY: 'auto' }}>
                  {props.employees.map((emp) => (
                    <Form.Check
                      key={emp.pk_employee}
                      type="checkbox"
                      label={`${emp.first_name} ${emp.last_name}`}
                      value={emp.pk_employee}
                      onChange={() => handleEmployeesChange(emp.pk_employee)}
                      isInvalid={!!formErrors.employees}
                    />
                  ))}
                </div>
              </div>
              <Form.Control.Feedback type="invalid">
                {formErrors.employees?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Liste de communication</Form.Label>
              <Form.Select
                onChange={(e) => setValue('communication', parseInt(e.target.value))}
                isInvalid={!!formErrors.communication}
              >
                {props.communications.map((com) => (
                  <option key={com.pk_communication} value={com.pk_communication}>
                    {com.description}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.communication?.message}
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
    </>
  );
}

export default AddDepartmentModal;