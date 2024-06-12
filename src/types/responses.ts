// Type de base pour les réponses du serveur
export type ResponseType<T> = {
  success: boolean;
  message: string;
  data: T;
}