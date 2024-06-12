/**
 * Convertit une date au format suisse francophone au style moyen
 *
 * @param dateToConvert La date à convertir
 */
export const dateFormatMedium = (dateToConvert: Date | string) => {
  return new Date(dateToConvert).toLocaleDateString('fr-ch', { dateStyle: 'medium' });
}

/**
 * Récupère l'âge à partir d'une date de naissance
 *
 * @param dateOfBirth La date de naissance
 */
export const getAgeFromDate = (dateOfBirth: Date | string): number => {
  // Contrôle du type de la date de naissance pour obtenir une date
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  // Récupération de la date du jour
  const today = new Date();
  // Contrôle de la différence d'année entre la date de naissance et la date du jour
  let age = today.getFullYear() - birthDate.getFullYear();
  // Contrôle de la différence de mois entre la date de naissance et la date du jour
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if ( monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate()) ) {
    age--;
  }
  return age;
}

/**
 * Convertit une date au format suisse francophone au style court (jour et mois)
 *
 * @param dateToConvert La date à convertir
 */
export const formatShortDates = (dateToConvert: string) => {
  // Récupération du jour et du mois de la date
  const [day, month] = dateToConvert.split('-');
  // Création d'une date à partir de la date de naissance'
  const date = new Date(new Date().getFullYear(), parseInt(month) - 1, parseInt(day));
  // Retourne la date au format court (jour et mois)
  return date.toLocaleDateString('fr-ch', { day: '2-digit', month: 'long' });
};