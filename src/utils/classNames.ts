/**
 * Permet de fusionner plusieurs classes CSS
 *
 * @param classes Les classes à fusionner
 */
export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
}
