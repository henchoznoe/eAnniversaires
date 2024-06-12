import { ResponseType } from "@/types/responses.ts";

// Types pour les réponses de la gestion des départements
export type GetDepartmentsType = ResponseType<DepartmentsDataType[]>;
export type AddDepartmentType = ResponseType<DepartmentsDataType>;
export type UpdateDepartmentType = ResponseType<DepartmentsDataType>;
export type DeleteDepartmentType = ResponseType<null>;

export type DepartmentsDataType = {
  pk_department: number;
  name: string;
  notify_by_mail: 0 | 1;
  notify_by_sms: 0 | 1;
  manager: {
    pk_employee: number;
    first_name: string;
    last_name: string;
  };
  communication: {
    pk_communication: number;
    description: string;
  };
  employees: {
    pk_employee: number;
    first_name: string;
    last_name: string;
  }[];
}