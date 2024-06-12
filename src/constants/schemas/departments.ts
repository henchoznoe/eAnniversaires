import { z } from "zod";
import { REGEX_DEPARTMENT_NAME } from "@/utils/regex.ts";

// Schéma de validation des données pour les départements
export const departmentSchema = z.object({
  name: z.string().regex(REGEX_DEPARTMENT_NAME, 'Format du nom du département invalide'),
  notify_by_mail: z.boolean(),
  notify_by_sms: z.boolean(),
  manager: z.number().min(1, 'Sélectionnez au moins un responsable'),
  communication: z.number().min(1, 'Sélectionnez au moins une liste de communications'),
  employees: z.array(z.number()).optional()
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;