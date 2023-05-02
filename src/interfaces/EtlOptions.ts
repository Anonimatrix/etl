export interface ConnectionOptions {
    host: string;
    username: string;
    password: string;
    database: string;
    port?: number;
}

export interface ClientAdapter {
    connect(options: ConnectionOptions): Promise<void> | void;
    query(query: string): Promise<void> | void;
    close(): Promise<void> | void;
}

export interface EtlOptions<T extends object> {
    table: string;
    connection: ConnectionOptions;
    formatters?: Formater[];
    transform?: Partial<Transform<T>>;
    client: ClientAdapter;
}

export type KeyOf<T extends object> = Extract<keyof T, string>;

export type Transform<T extends object> = {
    [key in KeyOf<T>]?: (object: any, value: string, client: ClientAdapter) => string;
};

export type Formater = (object: any, key: string, value: any) => void;
