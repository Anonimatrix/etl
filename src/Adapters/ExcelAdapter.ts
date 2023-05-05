import { FileAdapter } from "../interfaces/EtlOptions";
import reader from 'xlsx';

export class ExcelAdapter<T extends object> implements FileAdapter<T> {
    private filepath: string;
    private actualSheetIndex?: number;
    
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

        if(this.actualSheetIndex !== undefined) {
            const sheet = file.Sheets[sheets[this.actualSheetIndex]];
            data.push(...this.readSheet(sheet));
            
            return data;
        }

        for(let i = 0; i < sheets.length && !this.actualSheetIndex; i++)
        {
            const sheet = file.Sheets[sheets[i]];
            data.push(...this.readSheet(sheet));
        }

        return data;
    }

    readSheet(sheet:any) {
        const data: T[] = [];

        const temp = reader.utils.sheet_to_json(sheet, { defval: "" })
        temp.forEach((res: any) => {
            data.push(res as T);
        });

        return data;
    }

    getSheetNames(): string[] {
        const file = reader.readFile(this.filepath)
        return file.SheetNames;
    }

    setActualSheetIndex(index: number): void {
        this.actualSheetIndex = index;
    }
}