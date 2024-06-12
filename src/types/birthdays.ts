import { ResponseType } from "@/types/responses.ts";

// Types pour les réponses de la gestion des anniversaires
export type GetBirthdaysType = ResponseType<BirthdaysDataType[]>;
export type GetAdminBirthdaysType = ResponseType<AdminBirthdaysDataType[]>;

export type BirthdaysDataType = {
  pk_employee: number;
  first_name: string;
  last_name: string;
  birthday_date: string;
  birthday_type: string;
}

export type AdminBirthdaysDataType = BirthdaysDataType & {
  mail: string;
  tel_number: string;
  isAdmin: boolean;
}