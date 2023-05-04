import { ClientAdapter, ConnectionOptions } from "../interfaces/EtlOptions";
import { Pool } from "pg";

export class PostgresAdapter implements ClientAdapter {
    client?: Pool;

    connect(options: ConnectionOptions): Promise<void> | void {
        this.client = new Pool(options);
    }

    async query(query: string): Promise<void> {
        if (!this.client) {
            throw new Error("Client not connected");
        }

        await this.client.query(query);
    }

    close(): Promise<void> | void {
        this.client?.end();

        return Promise.resolve();
    }
}
