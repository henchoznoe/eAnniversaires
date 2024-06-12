// Expressions régulière pour vérifier le format des données de connexion
export const REGEX_LOGIN_MAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const REGEX_LOGIN_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,64}$/

// Expressions régulière pour vérifier le format des données des collaborateurs
export const REGEX_EMPLOYEE_FIRST_NAME = /^[a-zA-ZÀ-ÿ\s'-]{1,32}$/;
export const REGEX_EMPLOYEE_LAST_NAME = /^[a-zA-ZÀ-ÿ\s'-]{1,32}$/;
export const REGEX_EMPLOYEE_MAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const REGEX_EMPLOYEE_TEL_NUMBER = /^\+41[0-9]{9}$/;
export const REGEX_EMPLOYEE_DATE_OF_BIRTH = /^\d{4}-\d{2}-\d{2}$/;
export const REGEX_EMPLOYEE_DATE_OF_HIRE = /^\d{4}-\d{2}-\d{2}$/;

// Expressions régulière pour vérifier le format des données des départements
export const REGEX_DEPARTMENT_NAME = /^[a-zA-ZÀ-ÿ\s'-]{1,32}$/;