import { useEffect, useState } from "react";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { EmployeesDataType, GetEmployeesType } from "@/types/employees.ts";
import Loading from "@components/loading/Loading.tsx";
import Heading from "@components/heading/Heading.tsx";
import ErrorAlert from "@components/ErrorAlert.tsx";
import EmployeeCard from "@components/card/EmployeeCard.tsx";
import { CirclePlus } from "lucide-react";
import AddEmployeeModal from "@components/modal/employees/AddEmployeeModal.tsx";
import { DepartmentsDataType, GetDepartmentsType } from "@/types/departments.ts";

const Employees = () => {

  const { sendRequest, isLoading, errors } = useFetch();
  const authCtx = useAuth();

  const [employees, setEmployees] = useState<EmployeesDataType[]>([]);
  const [departments, setDepartments] = useState<DepartmentsDataType[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  useEffect(() => {
    // Récupérer les collaborateurs
    const fetchEmployees = async () => {
      const res: GetEmployeesType = await sendRequest(1, 'GET', 'action=getEmployees', null, { Authorization: `Bearer ${authCtx.token}` });
      if ( res.success ) {
        setEmployees(res.data);
      }
    };
    // Récupérer les départements
    const fetchDepartments = async () => {
      const res: GetDepartmentsType = await sendRequest(2, 'GET', 'action=getDepartments', null, { Authorization: `Bearer ${authCtx.token}` });
      if ( res.success ) {
        setDepartments(res.data);
      }
    }
    fetchEmployees();
    fetchDepartments();
  }, [authCtx.token, sendRequest]);

  // Ajoute dans le tableau local le collaborateur ajouté
  const onEmployeeAdded = (addedEmployee: EmployeesDataType) => {
    setEmployees((prev) => [...prev, addedEmployee])
  }

  // Met à jour dans le tableau local le collaborateur modifié
  const onEmployeeUpdated = (updatedEmployee: EmployeesDataType) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.pk_employee === updatedEmployee.pk_employee ? updatedEmployee : employee
      )
    );
  };

  // Supprime dans le tableau local le collaborateur supprimé
  const onEmployeeDeleted = (deletedEmployee: EmployeesDataType) => {
    setEmployees((prev) => prev.filter((employee) => employee.pk_employee !== deletedEmployee.pk_employee));
  }

  // Filtre les collaborateurs selon le filtre
  const filteredEmployees = employees.filter((employee) =>
    employee.first_name.concat(` ${employee.last_name}`).toLowerCase().includes(filter.toLowerCase()) ||
    employee.last_name.concat(` ${employee.first_name}`).toLowerCase().includes(filter.toLowerCase())
  );

  // Crée les cartes des collaborateurs filtrés
  const employeesCards = filteredEmployees.map((employee, index) => (
    <EmployeeCard
      key={index}
      employee={employee}
      departments={departments}
      onEmployeeUpdated={onEmployeeUpdated}
      onEmployeeDeleted={onEmployeeDeleted}
    />
  ));

  // Retounre un chargement de la page si le chargement est en cours
  if ( isLoading[1] || isLoading[2] ) return <Loading/>;
  // Retourne un message d'erreur si une erreur est survenue
  if ( errors[1] ) return <ErrorAlert variant="danger">{errors[1]}</ErrorAlert>;
  if ( errors[2] ) return <ErrorAlert variant="danger">{errors[2]}</ErrorAlert>;

  return (
    <>
      <Heading title="Collaborateurs"/>
      <div className="container">
        <div className="row mb-4 d-flex justify-content-between">
          <div className="col-7 col-sm-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filtrer par nom et/ou prénom"
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
          {filteredEmployees.length === 0 ? (
            <ErrorAlert variant="warning">Aucun collaborateur trouvé.</ErrorAlert>
          ) : (
            employeesCards
          )}
        </div>
      </div>
      <AddEmployeeModal
        showModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        departments={departments}
        onAddSuccess={onEmployeeAdded}
      />
    </>
  );
};

export default Employees;
