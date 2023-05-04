import { collision } from '../../src/Formaters/formaters';

describe('Collision', () => {
    it('Collision should be detected', () => {
        const obj = {lastnme: 'John'};
        collision(['lastname', 'age'], 0.8)(obj, 'lastnme', 'John');

        expect(obj).toEqual({lastname: 'John'});
    });

    it('Collision should not be detected', () => {
        const obj = {lastnme: 'John'};
        collision(['lastname', 'age'], 1)(obj, 'lastnme', 'Jane');

        expect(Object.keys(obj).length).toBe(0);
    })
});