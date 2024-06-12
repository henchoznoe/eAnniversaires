import { Alert, Form, Modal, Spinner } from "react-bootstrap";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { DepartmentsDataType } from "@/types/departments.ts";
import { AddEmployeeType, EmployeesDataType } from "@/types/employees.ts";
import { EmployeeFormData, employeeSchema } from "@/constants/schemas/employees.ts";

type AddEmployeeModalProps = {
  showModal: boolean;
  handleClose: () => void;
  departments: DepartmentsDataType[];
  onAddSuccess: (addedEmployee: EmployeesDataType) => void;
}

const AddEmployeeModal = (props: AddEmployeeModalProps) => {

  const { sendRequest, isLoading, errors } = useFetch();
  const authCtx = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors: formErrors }
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema)
  });

  const addEmployeeHandler = async (data: EmployeeFormData) => {
    const requestData = {
      ...data,
      departments: data.departments.map(pk_department => ({ pk_department }))
    }
    // Envoi de la requête d'ajout du collaborateur
    const res: AddEmployeeType = await sendRequest(
      1,
      'POST',
      null,
      JSON.stringify({ action: 'addEmployee', ...requestData }),
      { Authorization: `Bearer ${authCtx.token}` }
    );
    if ( res.success ) {
      toast.success(res.message);
      reset();
      props.handleClose();
      props.onAddSuccess(res.data);
    }
  };

  // Gestion de la sélection des départements
  const handleDepartmentChange = (pkDepartment: number) => {
    const currentValues = getValues('departments');
    if ( currentValues && currentValues.includes(pkDepartment) ) {
      setValue('departments', currentValues.filter(value => value !== pkDepartment));
    } else {
      setValue('departments', [...(currentValues || []), pkDepartment]);
    }
  };

  return (
    <Modal show={props.showModal} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un collaborateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(addEmployeeHandler)} className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between gap-3">
            <Form.Group className="w-100">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Prénom"
                {...register('first_name')}
                isInvalid={!!formErrors.first_name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.first_name?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="w-100">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom"
                {...register('last_name')}
                isInvalid={!!formErrors.last_name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.last_name?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Adresse e-mail"
              {...register('mail')}
              isInvalid={!!formErrors.mail}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.mail?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Numéro de téléphone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Numéro de téléphone"
              {...register('tel_number')}
              isInvalid={!!formErrors.tel_number}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.tel_number?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-between gap-3">
            <Form.Group className="w-100">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                min="1900-01-01"
                placeholder="Date de naissance"
                {...register('date_of_birth')}
                isInvalid={!!formErrors.date_of_birth}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.date_of_birth?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="w-100">
              <Form.Label>Date d'engagement</Form.Label>
              <Form.Control
                type="date"
                min="1900-01-01"
                placeholder="Date d'engagement"
                {...register('date_of_hire')}
                isInvalid={!!formErrors.date_of_hire}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.date_of_hire?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <Form.Group>
            <Form.Label>Départements</Form.Label>
            <div className="p-1" style={{ height: '140px', overflowY: 'auto' }}>
              {props.departments.map((dept) => (
                <Form.Check
                  key={dept.pk_department}
                  type="checkbox"
                  label={dept.name}
                  value={dept.pk_department}
                  onChange={() => handleDepartmentChange(dept.pk_department)}
                  isInvalid={!!formErrors.departments}
                />
              ))}
            </div>
            <Form.Control.Feedback type="invalid">
              {formErrors.departments?.message}
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

export default AddEmployeeModal;