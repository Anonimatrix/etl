import { Formater } from "../interfaces/EtlOptions";
import {Diff} from "diff";
import { memoization } from "../utils/memoization";

/**
 *  Change the names of the keys of the object
 * @param names object with the old name as key and the new name as value (the column name into database)
 * @returns 
 */
export const changeNames: <T extends object>(name: { [key: string]: keyof T }) => Formater = (names) => (obj, key, value) => {
    if (names[key]) {
        delete obj[key];
        obj[names[key]] = value;
    }
};

/**
 *  Trim the keys and values of the object
 * @param obj  The object to be formatted
 * @param key  The key of the object to be formatted
 * @param value  The value of the key to be formatted
 */
export const clear: Formater = (obj, key, value) => {
    delete obj[key];
    obj[key.trim()] = typeof value == "string" ? value.trim() : value;
};

const countCharsDiff = (col: string, otherCol: string) => {
    const diff = new Diff().diff(col, otherCol);
    let count = 0;
    for(const part of diff) {
        if(part.added || part.removed) count += part.value.length;
    }
    return count;
}


const isColCollision = (col: string, otherCol: string, accuracy: number) => {
    // Get the max length of the two strings and multiply by the accuracy
    const maxLen = Math.max(col.length, otherCol.length);
    const maxChars = maxLen - Math.floor(maxLen * accuracy);

    // Get the difference between the two strings
    const colDifference = col.toLowerCase().replace(otherCol.toLowerCase(), '');
    const countDifference = countCharsDiff(col, otherCol);

    // Check if the difference is not too big
    const differenceNotHasManyChars = countDifference <= maxChars;
    // Check if the difference is not a word
    const differenceNotHasOtherWord = !colDifference.includes('_');

    return (differenceNotHasManyChars && differenceNotHasOtherWord)
}

const memoizedIsColCollision = memoization(isColCollision, "collision");

/**
 *  Check if the key is a collision of the columns. Only conserves the columns with collision
 * @param cols  The columns to be checked
 * @param accuracy  The accuracy of the check
 * @param minLength  The minimum length of the key to be checked with accuracy. If the key is less than minLength, the key should be equal to the column
 * @param cache  If the function should be cached
 * @returns  A function that checks if the key is a collision of the columns
 */
export const collision: (cols: string[], accuracy?: number, minLength?: number, cache?: boolean) => Formater = (cols: string[], accuracy = 0.1, minLength = 3, cache = true) => async (obj, key, value) => {
    let collision = false;
    for(const col of cols) {
        const isColCollisionFun = cache ? memoizedIsColCollision : isColCollision;
        const minLengthCompare = minLength < key.length || col === key;

        if(minLengthCompare && (await isColCollisionFun(key, col, accuracy) || await isColCollisionFun(col, key, accuracy))) {
            delete obj[key];
            obj[col] = value;
            collision = true; 
            break; 
        }
    }

    if(!collision) delete obj[key];
}

/**
 *  Order the keys of the object
 * @param unordered  The object to be ordered
 * @param key  The key of the object to be ordered
 * @returns 
 */
export const orderByKeys: Formater = (unordered, key) => {
    const keys = Object.keys(unordered);
  
    if (keys[0] != key) return;
  
    keys.sort().forEach((value) => {
      const auxVal = unordered[value];
      delete unordered[value];
      unordered[value] = auxVal;
    });
  };