import { ResponseType } from "@/types/responses.ts";

// Types pour les réponses de la gestion des collaborateurs
export type GetEmployeesType = ResponseType<EmployeesDataType[]>;
export type AddEmployeeType = ResponseType<EmployeesDataType>;
export type UpdateEmployeeType = ResponseType<EmployeesDataType>;
export type DeleteEmployeeType = ResponseType<null>;

export type EmployeesDataType = {
  pk_employee: number;
  first_name: string;
  last_name: string;
  mail: string;
  tel_number: string;
  date_of_birth: string;
  date_of_hire: string;
  departments: {
    pk_department: number;
    name: string;
  }[];
}