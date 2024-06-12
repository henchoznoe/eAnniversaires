import { Button, Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";
import { dateFormatMedium } from "@/utils/date-format.ts";
import { Eye, Pen, Trash } from "lucide-react";
import { EmployeesDataType } from "@/types/employees.ts";
import DeleteEmployeeModal from "@components/modal/employees/DeleteEmployeeModal.tsx";
import { useState } from "react";
import UpdateEmployeeModal from "@components/modal/employees/UpdateEmployeeModal.tsx";
import { DepartmentsDataType } from "@/types/departments.ts";
import InfoEmployeeModal from "@components/modal/employees/InfoEmployeeModal.tsx";

type EmployeeCardProps = {
  employee: EmployeesDataType;
  departments: DepartmentsDataType[];
  onEmployeeUpdated: (updatedEmployee: EmployeesDataType) => void;
  onEmployeeDeleted: (deletedEmployee: EmployeesDataType) => void;
}

const EmployeeCard = (props: EmployeeCardProps) => {

  const emp = props.employee;

  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <Card>
        <CardHeader>
          <span className="fw-bold fs-5">{emp.first_name} {emp.last_name}</span>
        </CardHeader>
        <CardBody className="d-flex flex-column gap-1">
          <span>Né(e) le {dateFormatMedium(emp.date_of_birth)}</span>
          <a href={`mailto:${emp.mail}`} className="text-decoration-none text-black">{emp.mail}</a>
          <a href={`tel:${emp.tel_number}`} className="text-decoration-none text-black">{emp.tel_number}</a>
        </CardBody>
        <CardFooter className="d-flex justify-content-between">
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash/>
          </Button>
          <div className="d-flex gap-1">
            <Button variant="light" onClick={() => setShowUpdateModal(true)}>
              <Pen/>
            </Button>
            <button className="btn btn-teal" onClick={() => setShowInfoModal(true)}>
              <Eye/>
            </button>
          </div>
        </CardFooter>
      </Card>
      <InfoEmployeeModal
        showModal={showInfoModal}
        handleClose={() => setShowInfoModal(false)}
        employee={emp}
      />
      <UpdateEmployeeModal
        showModal={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        employee={emp}
        departments={props.departments}
        onUpdateSuccess={(updatedEmployee) => {
          setShowUpdateModal(false);
          props.onEmployeeUpdated(updatedEmployee);
        }}
      />
      <DeleteEmployeeModal
        showModal={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        employee={emp}
        onDeleteSuccess={(deletedEmployee) => {
          setShowDeleteModal(false);
          props.onEmployeeDeleted(deletedEmployee);
        }}
      />
    </div>
  );
}

export default EmployeeCard;