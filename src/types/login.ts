import { ResponseType } from "@/types/responses.ts";

// Type pour les réponses de l'authentification
export type LoginType = ResponseType<LoginDataType>;

export type LoginDataType = {
  mail: string;
  token: string;
  expiresAt: number;
}