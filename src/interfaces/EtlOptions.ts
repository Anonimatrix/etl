export interface ConnectionOptions {
    host: string;
    user: string;
    password: string;
    database: string;
    port?: number;
}

export interface ClientAdapter {
    connect(options: ConnectionOptions): Promise<void> | void;
    query(query: string): Promise<void> | void;
    close(): Promise<void> | void;
}

export interface FileAdapter<T extends object> {
    toArrayOfObject(): T[];
}

export interface EtlOptions<T extends object> {
    table: string;
    connection: ConnectionOptions;
    formatters?: Formater[];
    transform?: Partial<Transform<T>>;
    client: ClientAdapter;
    remove?: string[];
    chunkItems?: number;
}

export type KeyOf<T extends object> = Extract<keyof T, string>;

export type Transform<T extends object> = {
    [key in KeyOf<T>]?: (object: any, value: string, client: ClientAdapter) => string | number | null | Promise<string | number | null>;
};

export type Formater = (object: any, key: string, value: any) => void | Promise<void>;
