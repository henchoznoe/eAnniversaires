import { z } from "zod";
import { REGEX_LOGIN_MAIL, REGEX_LOGIN_PASSWORD } from "@/utils/regex.ts";

// Schéma de validation des données pour l'authentification
export const loginSchema = z.object({
  mail: z.string().regex(REGEX_LOGIN_MAIL, 'Format d\'email invalide'),
  password: z.string().regex(REGEX_LOGIN_PASSWORD, 'Format de mot de passe invalide. Min. 1 majuscule, 1 minuscule et une logueur de 12 à 64 caractères.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;