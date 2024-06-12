import { useCallback, useEffect, useRef, useState } from 'react';

// Hook personnalisé pour gérer les requêtes HTTP
export const useFetch = () => {

  // Récupérer l'URL de l'API depuis les variables d'environnement
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // État pour suivre les chargements en cours et les erreurs
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: number]: string | null }>({});

  // Référence pour suivre les requêtes actives
  const activeHttpRequests = useRef<Record<number, AbortController>>({});

  // Fonction pour envoyer une requête HTTP
  const sendRequest = useCallback(async (
    key: number,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    params: string | null,
    body: string | null,
    customHeaders = {}
  ) => {
    // Mettre à jour l'état pour signaler le chargement en cours
    setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [key]: true }));
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current[key] = httpAbortCtrl;

    try {
      // Configurer les en-têtes de la requête
      const headers = {
        'Content-Type': 'application/json',
        ...customHeaders
      };

      // Envoyer la requête HTTP avec paramètres si défini
      const response = await fetch(serverUrl + (params ? `?${params}` : ''), {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal
      });

      // Analyser la réponse HTTP en JSON
      const responseData = await response.json();

      // Supprimer la référence de la requête active
      delete activeHttpRequests.current[key];

      // Gérer les erreurs si la réponse n'est pas OK
      if ( !response.ok ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: responseData.message
        }));
        throw new Error(responseData.message);
      }

      // Nettoyer l'erreur associée à cette demande réussie
      setErrors((prevErrors) => ({ ...prevErrors, [key]: null }));

      // Mettre à jour l'état pour signaler que le chargement est terminé
      setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [key]: false }));
      return responseData;
    } catch ( err: any ) {
      // Gérer les erreurs, en ignorant celles provoquées par l'annulation de la requête
      if ( err.name !== 'AbortError' ) {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: err.message }));
        throw err;
      }
    } finally {
      // Supprimer la référence de la requête active et signaler que le chargement est terminé
      delete activeHttpRequests.current[key];
      setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [key]: false }));
    }
  }, []);

  // Effet pour nettoyer les requêtes actives lors du démontage du composant
  useEffect(() => {
    return () => {
      Object.values(activeHttpRequests.current).forEach((abortCtrl) =>
        abortCtrl.abort()
      );
    };
  }, []);

  // Retourner les états et les fonctions nécessaires
  return { sendRequest, isLoading, errors };
};