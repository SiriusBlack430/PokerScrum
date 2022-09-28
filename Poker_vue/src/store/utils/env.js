/**
 * @description: ¿Estoy en modo desarrollo?
 * @returns:
 * @example:
 */
 export function isDevMode() {
    return import.meta.env.DEV;
}