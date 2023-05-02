export interface ConnectionOptions {
    host: string;
    user: string;
    password: string;
    database: string;
}

export interface ClientAdapter {
    connect(options: ConnectionOptions): Promise<void> | void;
    query(query: string): Promise<void> | void;
    close(): Promise<void> | void;
}

export interface EtlOptions<T extends object> {
    table: string;
    connection: ConnectionOptions;
    formatters: Formater[];
    transform: Transform<T>;
    client: ClientAdapter;
}

export type KeyOf<T extends object> = Extract<keyof T, string>;

export type Transform<T extends object> = {
    [key in KeyOf<T>]: (value: string) => string;
};

export type Formater = (object: any, key: string, value: any) => void;
