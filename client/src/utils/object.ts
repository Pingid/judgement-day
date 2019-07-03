export const isKey = <E>(str: string): str is Extract<keyof E, string> => true;
