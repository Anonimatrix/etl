import { Etl } from '../src/Etl';
import { PostgresAdapter } from '../src/Adapters/PostgresAdapter';
import { ConnectionOptions, Formater } from '../src/interfaces/EtlOptions';
import { Query } from '../src/Query';

interface ITest {
    name: string;
    age: number;
}

describe('Etl main', () => {
    it('Should excecute the etl process', () => {
        const client = new PostgresAdapter();
        client.connect = jest.fn();
        client.close = jest.fn();
        client.query = jest.fn();

        const data = [
            {name: 'John', age: 20},
            {name: 'Jane', age: 30},
        ];

        new Etl<ITest>({
            table: "datos_bienes",
            connection: {} as ConnectionOptions,
            client,
        }).run(data);
    });

    it('Should excecute the etl process with formatters', async () => {
        let query = "";

        const formatters: Formater[] = [
            (obj, key, value) => {
                if (key === 'name') {
                    obj[key] = value.toUpperCase();
                }
            },
        ];

        const client = new PostgresAdapter();
        Query.fromObject = jest.fn((object) => Object.values(object).reduce((prev, curr) => prev + curr, ''));
        client.connect = jest.fn();
        client.close = jest.fn();
        client.query = jest.fn((q) => {
            query = q;
        });

        const data = [
            {name: 'John', age: 20},
            {name: 'Jane', age: 30},
        ];

        await new Etl<ITest>({
            table: "test",
            connection: {} as ConnectionOptions,
            client,
            formatters
        }).run(data);

        expect(query).toBe("JOHN20,JANE30");
    });

    it('Should excecute the etl process with transform', async () => {
        let query = "";

        const client = new PostgresAdapter();
        Query.fromObject = jest.fn((object) => Object.values(object).reduce((prev, curr) => prev + curr, ''));
        client.connect = jest.fn();
        client.close = jest.fn();
        client.query = jest.fn((q) => {
            query = q;
        });

        const data = [
            {name: 'John', age: 20},
            {name: 'Jane', age: 30},
        ];

        await new Etl<ITest>({
            table: "test",
            connection: {} as ConnectionOptions,
            client,
            transform: {
                name: (obj, value) => value.toUpperCase(),
            }
        }).run(data);

        expect(query).toBe("JOHN20,JANE30");
    });
})