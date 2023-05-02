export interface ConnectionOptions {
    host: string;
    user: string;
    password: string;
    database: string;
}

export interface ClientAdapter {
    connect(options: ConnectionOptions): Promise<void>;
    query(table: string, query: string): Promise<void>;
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

type Formater = (object: any, key: string, value: any) => void;
