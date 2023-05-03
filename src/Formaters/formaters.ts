import { Formater } from "../interfaces/EtlOptions";

export const changeNames: <T extends object>(name: { [key: string]: keyof T }) => Formater = (names) => (obj, key, value) => {
    if (names[key]) {
        delete obj[key];
        obj[names[key]] = value;
    } else {
        obj[key] = value;
    }

    return obj;
};

export const clear: Formater = (obj, key, value) => {
    delete obj[key];
    obj[key.trim()] = value.trim();
};

const isColCollision = (col: string, otherCol: string, accuracy: number) => {
    // Get the max length of the two strings and multiply by the accuracy
    const maxLen = Math.max(col.length, otherCol.length);
    const maxChars = maxLen - Math.floor(maxLen * accuracy);

    // Get the difference between the two strings
    const colDifference = col.toLowerCase().replace(otherCol.toLowerCase(), '');
    // Check if the difference is not too big
    const differenceNotHasManyChars = colDifference.length < maxChars;
    // Check if the difference is not a word
    const differenceNotHasOtherWord = !colDifference.includes('_');

    return (differenceNotHasManyChars && differenceNotHasOtherWord)
}

export const collision: (cols: string[], accuracy: number) => Formater = (cols: string[], accuracy = 0.1) => (obj, key, value) => {
    let collision = false;
    for(const col of cols) {
        if(isColCollision(key, col, accuracy) || isColCollision(col, key, accuracy)) {
            delete obj[key]
            obj[col] = value;
            collision = true; 
            break; 
        }
    }
        
    if(!collision) delete obj[key];
}