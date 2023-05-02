import { Query } from "./Query";
import { EtlOptions, KeyOf } from "./interfaces/EtlOptions";

export class Etl<T extends object> {
    constructor(private readonly options: EtlOptions<T>) {
        this.options = options;
    }

    public async run(obj: T): Promise<void> {
        this.connect();
        obj = await this.format(obj);
        obj = await this.transform(obj);
        await this.insert(obj);
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
        const newObj: T = { ...obj };

        Object.entries(newObj).forEach(([key, value]) => {
            if (transform.hasOwnProperty(key)) {
                newObj[key as keyof T] = transform[key as KeyOf<T>](
                    value
                ) as any;
            } else {
                newObj[key as keyof T] = value;
            }
        });

        return obj;
    }

    private async insert(obj: T): Promise<void> {
        const { client, table } = this.options;

        const query = await Query.fromObject(obj, table);

        await client.query(query);
    }
}
