import { ClientAdapter, ConnectionOptions } from "../interfaces/EtlOptions";
import { Pool } from "pg";

export class PostgresAdapter implements ClientAdapter {
    client?: Pool;

    connect(options: ConnectionOptions): Promise<void> | void {
        this.client = new Pool(options);
    }

    query(query: string): Promise<void> | void {
        if (!this.client) {
            throw new Error("Client not connected");
        }

        return this.client.query(query).then((res) => {
            console.log(res);
        });
    }

    close(): Promise<void> | void {
        this.client?.end();

        return Promise.resolve();
    }
}
