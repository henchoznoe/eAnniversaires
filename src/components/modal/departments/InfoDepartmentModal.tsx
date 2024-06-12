import { Modal } from "react-bootstrap";
import { DepartmentsDataType } from "@/types/departments.ts";

type InfoDepartmentModalProps = {
  showModal: boolean;
  handleClose: () => void;
  department: DepartmentsDataType;
}

const InfoEmployeeModal = (props: InfoDepartmentModalProps) => {

  const dep = props.department;

  return (
    <Modal show={props.showModal} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Informations du département</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-1">
        <span className="fs-3 fw-medium">{dep.name}</span>
        <hr/>
        <h5>Responsable</h5>
        <span>{dep.manager.first_name.concat(` ${dep.manager.last_name}`)}</span>
        <hr/>
        <h5>Notifications pour les collaborateurs</h5>
        <span>Par Mail : {dep.notify_by_mail === 1 ? 'Oui' : 'Non'}</span>
        <span>Par SMS : {dep.notify_by_sms === 1 ? 'Oui' : 'Non'}</span>
        <hr/>
        <h5>Communications pour les collaborateurs</h5>
        <span>{dep.communication.description}</span>
        <hr/>
        <h5>Collaborateurs membres</h5>
        <div style={{ height: '100px', overflowY: 'auto' }}>
          {dep.employees.map((employee, index) => (
            <div key={index}>
              <span>{employee.first_name.concat(` ${employee.last_name}`)}</span>
              <br/>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default InfoEmployeeModal;