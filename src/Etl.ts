import { Query } from "./Query";
import { EtlOptions, KeyOf } from "./interfaces/EtlOptions";

export class Etl<T extends object> {
    constructor(private readonly options: EtlOptions<T>) {
        this.options = options;
    }

    public async run(data: T[]): Promise<void> {
        this.connect();

        let query: string = "";
        let index = 0;

        for (let item of data) {
            item = await this.format(item);
            item = await this.transform(item);

            query += await Query.fromObject(item, this.options.table, index);
            index++;
        }

        await this.insert(query);

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

        formatters.forEach((format) => {
            Object.entries(newObj as object).forEach(([key, value]) => {
                format(newObj, key, value);
            });
        });

        return obj;
    }

    private async transform(obj: T): Promise<T> {
        const { transform } = this.options;

        if (!transform) return obj;

        const newObj: T = { ...obj };

        Object.entries(newObj).forEach(async ([key, value]) => {
            if (transform.hasOwnProperty(key)) {
                newObj[key as keyof T] = await transform[key as KeyOf<T>]?.(
                    obj,
                    value,
                    this.options.client
                ) as any;
            } else {
                newObj[key as keyof T] = value;
            }
        });

        return newObj;
    }

    private async insert(query: string): Promise<void> {
        const { client } = this.options;

        await client.query(query);
    }
}
