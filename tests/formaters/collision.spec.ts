import { collision } from '../../src/Formaters/formaters';

describe('Collision', () => {
    it('Collision should be detected', () => {
        const obj = {lastnm: 'John'};
        collision(['lastname', 'age'], 0.7)(obj, 'lastnm', 'John');

        expect(obj).toEqual({lastname: 'John'});
    });

    it('Collision should not be detected', () => {
        const obj = {lastnme: 'John'};
        collision(['lastname', 'age'], 1)(obj, 'lastnme', 'Jane');

        expect(Object.keys(obj).length).toBe(0);
    })
});