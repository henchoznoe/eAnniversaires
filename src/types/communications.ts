import { ResponseType } from "@/types/responses.ts";

// Types pour les réponses de la gestion des communications
export type GetCommunicationsType = ResponseType<CommunicationsDataType[]>;
export type AddCommunicationsType = ResponseType<CommunicationsDataType>;
export type UpdateCommunicationsType = ResponseType<CommunicationsDataType>;
export type DeleteCommunicationsType = ResponseType<null>;

export type CommunicationsDataType = {
  pk_communication: number;
  description: string;
  birthday_msg: string;
  html_birthday_msg: string;
  notification_delay: number;
}