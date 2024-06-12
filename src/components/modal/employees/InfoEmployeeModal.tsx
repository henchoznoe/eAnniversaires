import { EmployeesDataType } from "@/types/employees.ts";
import { Modal } from "react-bootstrap";
import { dateFormatMedium, getAgeFromDate } from "@/utils/date-format.ts";

type InfoEmployeeModalProps = {
  showModal: boolean;
  handleClose: () => void;
  employee: EmployeesDataType;
}

const InfoEmployeeModal = (props: InfoEmployeeModalProps) => {

  const emp = props.employee;

  return (
    <Modal show={props.showModal} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Informations du collaborateur</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-1">
        <span className="fs-3 fw-medium">{emp.first_name.concat(` ${emp.last_name}`)}</span>
        <hr/>
        <h5>Coordonnées</h5>
        <span>Né(e) le {dateFormatMedium(emp.date_of_birth)} ({getAgeFromDate(emp.date_of_birth)} ans)</span>
        <a href={`mailto:${emp.mail}`} className="text-decoration-none text-black">{emp.mail}</a>
        <a href={`tel:${emp.tel_number}`} className="text-decoration-none text-black">{emp.tel_number}</a>
        <hr/>
        <h5>En rapport avec l'entreprise</h5>
        <span>Engagé(e) le {dateFormatMedium(emp.date_of_hire)}</span>
        <span>Fait partie de : {emp.departments.map((dep) => dep.name).join(", ")}</span>
      </Modal.Body>
    </Modal>
  );
}

export default InfoEmployeeModal;