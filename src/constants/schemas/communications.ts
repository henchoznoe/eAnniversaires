import { z } from 'zod';

// Schéma de validation des données pour les communications
export const communicationsSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  birthday_msg: z.string().min(1, 'Le message d\'anniversaire est requis'),
  html_birthday_msg: z.string().min(1, 'Le message d\'anniversaire en HTML est requis'),
  notification_delay: z.number().min(1, 'Le délai de notification doit être au moins 1').max(30, 'Le délai de notification ne peut pas dépasser 30 jours')
});

export type CommunicationsFormData = z.infer<typeof communicationsSchema>;