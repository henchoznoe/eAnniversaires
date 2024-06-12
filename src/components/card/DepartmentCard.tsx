import { DepartmentsDataType } from "@/types/departments.ts";
import { EmployeesDataType } from "@/types/employees.ts";
import { Button, Card, CardBody, CardFooter, CardHeader, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Mail, MessageCircle, Pen, Trash } from "lucide-react";
import { useState } from "react";
import InfoDepartmentModal from "@components/modal/departments/InfoDepartmentModal.tsx";
import UpdateDepartmentModal from "@components/modal/departments/UpdateDepartmentModal.tsx";
import { CommunicationsDataType } from "@/types/communications.ts";
import DeleteDepartmentModal from "@components/modal/departments/DeleteDepartmentModal.tsx";

type DepartmentCardProps = {
  department: DepartmentsDataType;
  employees: EmployeesDataType[];
  communications: CommunicationsDataType[];
  onDepartmentUpdated: (updatedDepartment: DepartmentsDataType) => void;
  onDepartmentDeleted: (deletedDepartment: DepartmentsDataType) => void;
}

const DepartmentCard = (props: DepartmentCardProps) => {

  const dep = props.department;

  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <Card>
        <CardHeader>
          <span className="fw-bold fs-5">{dep.name}</span>
        </CardHeader>
        <CardBody className="d-flex flex-column gap-2">
          <span>Responsable : {dep.manager.first_name.concat(` ${dep.manager.last_name}`)}</span>
          <div className="d-flex gap-2">
            <span>Notifications :</span>
            <div className="d-flex gap-2">
              <OverlayTrigger overlay={<Tooltip id="tooltip-top">Mail</Tooltip>}>
                <Mail className={dep.notify_by_mail ? 'text-success' : 'text-danger'}/>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip id="tooltip-top">SMS</Tooltip>}>
                <MessageCircle className={dep.notify_by_sms ? 'text-success' : 'text-danger'}/>
              </OverlayTrigger>
            </div>
          </div>
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
      <InfoDepartmentModal
        showModal={showInfoModal}
        handleClose={() => setShowInfoModal(false)}
        department={dep}
      />
      <UpdateDepartmentModal
        showModal={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        department={dep}
        employees={props.employees}
        communications={props.communications}
        onUpdateSuccess={(updatedDepartment) => {
          setShowUpdateModal(false);
          props.onDepartmentUpdated(updatedDepartment);
        }}
      />
      <DeleteDepartmentModal
        showModal={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        department={dep}
        onDeleteSuccess={(deletedDepartment) => {
          setShowDeleteModal(false);
          props.onDepartmentDeleted(deletedDepartment);
        }}
      />
    </div>
  );
}

export default DepartmentCard;