import { Query } from "./Query";
import { EtlOptions, FileAdapter, KeyOf } from "./interfaces/EtlOptions";

export class Etl<T extends object> {
    constructor(private readonly options: EtlOptions<T>) {
        this.options = options;
    }

    /**
     *  Insert data into the database using the options provided from a file
     * @param fileAdapter File adapter to read the file
     */
    public async fromFile(fileAdapter: FileAdapter<T>): Promise<void> {
        const data = fileAdapter.toArrayOfObject();

        await this.run(data);
    }

    /**
     *  Insert data into the database using the options provided
     * @param data Array of objects to be inserted into the database
     */
    public async run(data: T[]): Promise<void> {
        this.connect();

        let query: string = "";
        let index = 0;

        for (let item of data) {
            item = await this.format(item);
            item = await this.transform(item);
            item = await this.remove(item);

            //Add the query to the string and add a comma
            query += await Query.fromObject(item, this.options.table, index) + ',';
            
            if(this.options.chunkItems && index % this.options.chunkItems === 0 && index !== 0) {
                await this.insert(query.slice(0, -1));
                query = "";
            }
            
            index++;
        }

        if(query.length > 0) {
            //Remove the last comma
            query = query.slice(0, -1);

            await this.insert(query);
        }

        await this.close();
    }

    private async connect() {
        const { client } = this.options;

        await client.connect(this.options.connection);
    }

    private async close() {
        const { client } = this.options;

        await client.close();
    }

    private async format(obj: T): Promise<T> {
        const { formatters } = this.options;

        if (!formatters) return obj;

        const newObj: T = { ...obj };

        for (let formater of formatters) {
            for(let entry of Object.entries(newObj)) {
                const [key, value] = entry;
                await formater(newObj, key, value);
            }
        }

        return newObj;
    }

    private async remove(obj: T): Promise<T> {
        const { remove } = this.options;

        if (!remove) return obj;

        const newObj: T = { ...obj };

        remove.forEach((key) => {
            delete newObj[key as keyof T];
        });

        return newObj;
    }

    private async transform(obj: T): Promise<T> {
        const { transform } = this.options;

        if (!transform) return obj;

        const newObj: T = { ...obj };

        for(let key in transform) {
            const value: any = obj[key as keyof T];

            if (value == null) delete newObj[key as keyof T];

            let newValue: string | number | null = null;

            try {
                newValue = await transform[key as KeyOf<T>]?.(obj, value, this.options.client) || null;
            } catch (e) {
                const msgError = e instanceof Error ? e.message : e;
                console.error(`Error transforming ${key}: ${msgError}`);
            }

            newObj[key as keyof T] = newValue as any;
        }

        return newObj;
    }

    private async insert(query: string): Promise<void> {
        const { client } = this.options;

        await client.query(query);
    }
}
