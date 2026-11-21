type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Tiny replacement for clsx. */
export const cx = (...classes: ClassValue[]): string => classes.filter(Boolean).join(' ');
