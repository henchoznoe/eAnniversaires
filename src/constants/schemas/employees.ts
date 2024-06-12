import { z } from "zod";
import {
  REGEX_EMPLOYEE_DATE_OF_BIRTH,
  REGEX_EMPLOYEE_DATE_OF_HIRE,
  REGEX_EMPLOYEE_FIRST_NAME,
  REGEX_EMPLOYEE_LAST_NAME,
  REGEX_EMPLOYEE_MAIL,
  REGEX_EMPLOYEE_TEL_NUMBER
} from "@/utils/regex.ts";

// Schéma de validation des données pour les collaborateurs
export const employeeSchema = z.object({
  first_name: z.string().regex(REGEX_EMPLOYEE_FIRST_NAME, 'Format de prénom invalide'),
  last_name: z.string().regex(REGEX_EMPLOYEE_LAST_NAME, 'Format de nom invalide'),
  mail: z.string().regex(REGEX_EMPLOYEE_MAIL, 'Format d\'email invalide'),
  tel_number: z.string().regex(REGEX_EMPLOYEE_TEL_NUMBER, 'Format de numéro de téléphone invalide'),
  date_of_birth: z.string()
    .regex(REGEX_EMPLOYEE_DATE_OF_BIRTH, 'Format de date de naissance invalide')
    .refine(date => new Date(date) <= new Date(), {
      message: 'La date de naissance ne peut pas être dans le futur',
    }),
  date_of_hire: z.string().regex(REGEX_EMPLOYEE_DATE_OF_HIRE, 'Format de date d\'engagement invalide'),
  departments: z.array(z.number()).min(1, 'Sélectionnez au moins un département'),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;