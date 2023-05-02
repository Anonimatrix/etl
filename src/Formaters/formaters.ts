import { Formater } from "../interfaces/EtlOptions";

export const clear: Formater = (obj, key, value) => {
    delete obj[key];
    obj[key.trim()] = value.trim();
};
