import { collision } from '../../src/Formaters/formaters';

describe('Collision', () => {
    it('Collision should be detected', async () => {
        const obj = {lastnm: 'John'};
        await collision(['lastname', 'age'], 0.7, 4, true)(obj, 'lastnm', 'John');

        expect(obj).toEqual({lastname: 'John'});
    });

    it('Collision should not be detected', async () => {
        const obj = {lastnme: 'John'};
        await collision(['lastname', 'age'], 1, 4, true)(obj, 'lastnme', 'Jane');

        expect(Object.keys(obj).length).toBe(0);
    })
});