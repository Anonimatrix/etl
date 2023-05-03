import { FileAdapter } from "../interfaces/EtlOptions";
import reader from 'xlsx';

export class ExcelAdapter<T extends object> implements FileAdapter<T> {
    private filepath: string;
    
    constructor(filepath: string) {
        this.filepath = filepath;
    }

    /**
     *  Convert the excel file to an array of objects
     * @returns Array of objects from the excel file
     */
    toArrayOfObject(): T[]{
        const data: T[] = [];
        const file = reader.readFile(this.filepath)
        const sheets = file.SheetNames;

        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res as T)
            })
        }

        return data;
    }
}