import Heading from "@components/heading/Heading.tsx";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { useEffect, useState } from "react";
import { EmployeesDataType, GetEmployeesType } from "@/types/employees.ts";
import { DepartmentsDataType, GetDepartmentsType } from "@/types/departments.ts";
import Loading from "@components/loading/Loading.tsx";
import ErrorAlert from "@components/ErrorAlert.tsx";
import { CirclePlus } from "lucide-react";
import DepartmentCard from "@components/card/DepartmentCard.tsx";
import AddDepartmentModal from "@components/modal/departments/AddDepartmentModal.tsx";
import { CommunicationsDataType, GetCommunicationsType } from "@/types/communications.ts";

const Departments = () => {

  const { sendRequest, isLoading, errors } = useFetch();
  const authCtx = useAuth();

  const [departments, setDepartments] = useState<DepartmentsDataType[]>([]);
  const [employees, setEmployees] = useState<EmployeesDataType[]>([]);
  const [communications, setCommunications] = useState<CommunicationsDataType[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  useEffect(() => {
    // Récupérer les départements
    const fetchDepartments = async () => {
      const res: GetDepartmentsType = await sendRequest(1, 'GET', 'action=getDepartments', null, { Authorization: `Bearer ${authCtx.token}` });
      if ( res.success ) {
        setDepartments(res.data);
      }
    }
    // Récupérer les collaborateurs
    const fetchEmployees = async () => {
      const res: GetEmployeesType = await sendRequest(2, 'GET', 'action=getEmployees', null, { Authorization: `Bearer ${authCtx.token}` });
      if ( res.success ) {
        setEmployees(res.data);
      }
    };
    // Récupérer les communications
    const fetchCommunications = async () => {
      const res: GetCommunicationsType = await sendRequest(3, 'GET', 'action=getCommunications', null, { Authorization: `Bearer ${authCtx.token}` });
      if ( res.success ) {
        setCommunications(res.data);
      }
    };
    fetchDepartments();
    fetchEmployees();
    fetchCommunications();
  }, [authCtx.token, sendRequest]);

  // Ajoute dans le tableau local le département ajouté
  const onDepartmentAdded = (addedDepartment: DepartmentsDataType) => {
    setDepartments([...departments, addedDepartment]);
  }

  // Met à jour dans le tableau local le département modifié
  const onDepartmentUpdated = (updatedDepartment: DepartmentsDataType) => {
    setDepartments((prev) =>
      prev.map((dep) =>
        dep.pk_department === updatedDepartment.pk_department ? updatedDepartment : dep
      )
    );
  }

  // Supprime dans le tableau local le département supprimé
  const onDepartmentDeleted = (deletedDepartment: DepartmentsDataType) => {
    setDepartments((prev) => prev.filter((dep) => dep.pk_department !== deletedDepartment.pk_department));
  }

  // Filtre les départements selon le filtre
  const filteredDepartments = departments.filter((dep) => dep.name.toLowerCase().includes(filter.toLowerCase()));

  // Crée les cartes des départements filtrés
  const departmentsCards = filteredDepartments.map((dep) => (
    <DepartmentCard
      key={dep.pk_department}
      department={dep}
      employees={employees}
      communications={communications}
      onDepartmentUpdated={onDepartmentUpdated}
      onDepartmentDeleted={onDepartmentDeleted}
    />
  ));

  // Retounre un chargement de la page si le chargement est en cours
  if ( isLoading[1] || isLoading[2] || isLoading[3] ) return <Loading/>;
  // Retourne un message d'erreur si une erreur est survenue
  if ( errors[1] ) return <ErrorAlert variant="danger">{errors[1]}</ErrorAlert>;
  if ( errors[2] ) return <ErrorAlert variant="danger">{errors[2]}</ErrorAlert>;
  if ( errors[3] ) return <ErrorAlert variant="danger">{errors[3]}</ErrorAlert>;

  return (
    <>
      <Heading title="Départements"/>
      <div className="container">
        <div className="row mb-4 d-flex justify-content-between">
          <div className="col-7 col-sm-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filtrer par nom"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="col-3 d-flex justify-content-end">
            <button
              className="btn btn-teal d-flex justify-content-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              Ajouter <CirclePlus/>
            </button>
          </div>
        </div>
        <div className="row">
          {filteredDepartments.length === 0 ? (
            <ErrorAlert variant="warning">Aucun département trouvé.</ErrorAlert>
          ) : (
            departmentsCards
          )}
        </div>
      </div>
      <AddDepartmentModal
        showModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        employees={employees}
        communications={communications}
        onAddSuccess={onDepartmentAdded}
      />
    </>
  );
}

export default Departments;